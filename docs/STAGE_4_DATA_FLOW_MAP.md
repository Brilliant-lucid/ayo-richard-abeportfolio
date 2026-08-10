# Stage 4 — Data Flow Map

**Date:** 2026-08-10

## 1. Account creation

```text
Visitor
  ↓
/auth
  ↓
Supabase Auth
  ↓
Authenticated user/session
  ↓
Authenticated application routes
```

## 2. Portfolio management

```text
Authenticated user
  ↓
/admin/*
  ↓
Form/action
  ↓
Zod validation
  ↓
Authentication/ownership check
  ↓
Server function
  ↓
Supabase PostgreSQL
  ↓
Updated portfolio data
```

## 3. Public portfolio request

```text
Visitor
  ↓
/u/:username/*
  ↓
Resolve published portfolio
  ↓
Resolve owner
  ↓
Query owner-scoped published content
  ↓
Render public portfolio
```

## 4. Media upload

```text
Authenticated user
  ↓
Admin media form
  ↓
FormData
  ↓
Server upload function
  ↓
User-scoped Storage path
  ↓
Supabase Storage
  ↓
Signed URL
  ↓
Portfolio record/rendering
```

## 5. Contact

```text
Visitor
  ↓
Public contact dialog
  ↓
Validated contact payload
  ↓
Public server function
  ↓
Portfolio resolution
  ↓
Contact record
  ↓
Email notification attempt
```

## 6. Service inquiry

```text
Visitor
  ↓
Service selection/contact flow
  ↓
Validate portfolio + service ownership
  ↓
Create service inquiry
  ↓
Create/derive message record
  ↓
Email notification attempt
```

The dual-write portion is transitional and requires a final consistency model.

## 7. MCP

```text
MCP client
  ↓
/mcp
  ↓
MCP authentication
  ↓
Registered tool
  ↓
Caller-scoped Supabase access
  ↓
Portfolio data
```

## 8. Critical trust boundaries

```text
UNTRUSTED
Visitor/browser/MCP client
        ↓
AUTHENTICATION BOUNDARY
Supabase Auth / MCP auth
        ↓
AUTHORIZATION BOUNDARY
Authenticated user + ownership rules
        ↓
PRIVILEGED SERVER BOUNDARY
Service-role Supabase client
        ↓
DATA BOUNDARY
PostgreSQL / Storage
```

The service-role boundary is the highest-risk architectural boundary because it bypasses Row Level Security (RLS).