IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [pharmacies] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(255) NOT NULL,
    [Email] nvarchar(255) NOT NULL,
    [Phone] nvarchar(50) NULL,
    [LicenseNumber] nvarchar(100) NULL,
    [PasswordHash] nvarchar(max) NOT NULL,
    [Latitude] float NULL,
    [Longitude] float NULL,
    [Status] nvarchar(32) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_pharmacies] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [users] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(255) NOT NULL,
    [Email] nvarchar(255) NOT NULL,
    [Phone] nvarchar(50) NULL,
    [PasswordHash] nvarchar(max) NOT NULL,
    [Role] nvarchar(32) NOT NULL,
    [Latitude] float NULL,
    [Longitude] float NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_users] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [notifications] (
    [Id] int NOT NULL IDENTITY,
    [UserId] int NULL,
    [PharmacyId] int NULL,
    [Type] nvarchar(64) NOT NULL,
    [Message] nvarchar(1000) NOT NULL,
    [IsRead] bit NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_notifications] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_notifications_pharmacies_PharmacyId] FOREIGN KEY ([PharmacyId]) REFERENCES [pharmacies] ([Id]),
    CONSTRAINT [FK_notifications_users_UserId] FOREIGN KEY ([UserId]) REFERENCES [users] ([Id])
);
GO

CREATE TABLE [requests] (
    [Id] int NOT NULL IDENTITY,
    [PatientId] int NOT NULL,
    [PrescriptionUrl] nvarchar(max) NULL,
    [Status] nvarchar(32) NOT NULL,
    [ExpiresAt] datetime2 NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_requests] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_requests_users_PatientId] FOREIGN KEY ([PatientId]) REFERENCES [users] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [orders] (
    [Id] int NOT NULL IDENTITY,
    [PatientId] int NOT NULL,
    [PharmacyId] int NOT NULL,
    [RequestId] int NOT NULL,
    [Delivery] bit NOT NULL,
    [DeliveryFee] decimal(18,2) NOT NULL,
    [TotalPrice] decimal(18,2) NOT NULL,
    [Status] nvarchar(32) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_orders] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_orders_pharmacies_PharmacyId] FOREIGN KEY ([PharmacyId]) REFERENCES [pharmacies] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_orders_requests_RequestId] FOREIGN KEY ([RequestId]) REFERENCES [requests] ([Id]),
    CONSTRAINT [FK_orders_users_PatientId] FOREIGN KEY ([PatientId]) REFERENCES [users] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [pharmacy_responses] (
    [Id] int NOT NULL IDENTITY,
    [PharmacyId] int NOT NULL,
    [RequestId] int NOT NULL,
    [DeliveryFee] decimal(18,2) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_pharmacy_responses] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_pharmacy_responses_pharmacies_PharmacyId] FOREIGN KEY ([PharmacyId]) REFERENCES [pharmacies] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_pharmacy_responses_requests_RequestId] FOREIGN KEY ([RequestId]) REFERENCES [requests] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [request_medicines] (
    [Id] int NOT NULL IDENTITY,
    [RequestId] int NOT NULL,
    [MedicineName] nvarchar(255) NOT NULL,
    [Quantity] int NOT NULL,
    CONSTRAINT [PK_request_medicines] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_request_medicines_requests_RequestId] FOREIGN KEY ([RequestId]) REFERENCES [requests] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [order_items] (
    [Id] int NOT NULL IDENTITY,
    [OrderId] int NOT NULL,
    [MedicineName] nvarchar(255) NOT NULL,
    [Quantity] int NOT NULL,
    [Price] decimal(18,2) NOT NULL,
    CONSTRAINT [PK_order_items] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_order_items_orders_OrderId] FOREIGN KEY ([OrderId]) REFERENCES [orders] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [response_medicines] (
    [Id] int NOT NULL IDENTITY,
    [ResponseId] int NOT NULL,
    [MedicineName] nvarchar(255) NOT NULL,
    [Available] bit NOT NULL,
    [QuantityAvailable] int NOT NULL,
    [Price] decimal(18,2) NOT NULL,
    CONSTRAINT [PK_response_medicines] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_response_medicines_pharmacy_responses_ResponseId] FOREIGN KEY ([ResponseId]) REFERENCES [pharmacy_responses] ([Id]) ON DELETE CASCADE
);
GO

CREATE INDEX [IX_notifications_PharmacyId] ON [notifications] ([PharmacyId]);
GO

CREATE INDEX [IX_notifications_UserId] ON [notifications] ([UserId]);
GO

CREATE INDEX [IX_order_items_OrderId] ON [order_items] ([OrderId]);
GO

CREATE INDEX [IX_orders_PatientId] ON [orders] ([PatientId]);
GO

CREATE INDEX [IX_orders_PharmacyId] ON [orders] ([PharmacyId]);
GO

CREATE INDEX [IX_orders_RequestId] ON [orders] ([RequestId]);
GO

CREATE UNIQUE INDEX [IX_pharmacies_Email] ON [pharmacies] ([Email]);
GO

CREATE INDEX [IX_pharmacy_responses_PharmacyId] ON [pharmacy_responses] ([PharmacyId]);
GO

CREATE INDEX [IX_pharmacy_responses_RequestId] ON [pharmacy_responses] ([RequestId]);
GO

CREATE INDEX [IX_request_medicines_RequestId] ON [request_medicines] ([RequestId]);
GO

CREATE INDEX [IX_requests_PatientId] ON [requests] ([PatientId]);
GO

CREATE INDEX [IX_response_medicines_ResponseId] ON [response_medicines] ([ResponseId]);
GO

CREATE UNIQUE INDEX [IX_users_Email] ON [users] ([Email]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260313031157_InitialCreate', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [notifications] DROP CONSTRAINT [FK_notifications_users_UserId];
GO

ALTER TABLE [orders] DROP CONSTRAINT [FK_orders_users_PatientId];
GO

ALTER TABLE [requests] DROP CONSTRAINT [FK_requests_users_PatientId];
GO

DROP TABLE [users];
GO

EXEC sp_rename N'[notifications].[UserId]', N'PatientId', N'COLUMN';
GO

EXEC sp_rename N'[notifications].[IX_notifications_UserId]', N'IX_notifications_PatientId', N'INDEX';
GO

CREATE TABLE [admins] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(255) NOT NULL,
    [Email] nvarchar(255) NOT NULL,
    [Phone] nvarchar(50) NULL,
    [PasswordHash] nvarchar(max) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_admins] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [patients] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(255) NOT NULL,
    [Email] nvarchar(255) NOT NULL,
    [Phone] nvarchar(50) NULL,
    [PasswordHash] nvarchar(max) NOT NULL,
    [Latitude] float NULL,
    [Longitude] float NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_patients] PRIMARY KEY ([Id])
);
GO

CREATE UNIQUE INDEX [IX_admins_Email] ON [admins] ([Email]);
GO

CREATE UNIQUE INDEX [IX_patients_Email] ON [patients] ([Email]);
GO

ALTER TABLE [notifications] ADD CONSTRAINT [FK_notifications_patients_PatientId] FOREIGN KEY ([PatientId]) REFERENCES [patients] ([Id]);
GO

ALTER TABLE [orders] ADD CONSTRAINT [FK_orders_patients_PatientId] FOREIGN KEY ([PatientId]) REFERENCES [patients] ([Id]) ON DELETE CASCADE;
GO

ALTER TABLE [requests] ADD CONSTRAINT [FK_requests_patients_PatientId] FOREIGN KEY ([PatientId]) REFERENCES [patients] ([Id]) ON DELETE CASCADE;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260409164141_SplitIdentityTablesAndOtpTesting', N'8.0.0');
GO

COMMIT;
GO

