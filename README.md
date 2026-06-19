# PDFSign Frontend

Frontend application for PDFSign, an online document signing platform that enables users to upload PDFs, place signatures, and securely manage signed documents.

## Features

* User Authentication
* Secure Login & Registration
* OTP-Based Password Recovery
* PDF Upload Interface
* PDF Preview and Viewing
* Drag & Drop Signature Placement
* Download Signed Documents
* Responsive User Interface
* State Management with Redux Toolkit

## Tech Stack

* Next.js
* React.js
* TypeScript
* Redux Toolkit
* Axios
* React PDF
* Tailwind CSS

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Features Overview

### Authentication

* User Registration
* User Login
* User Logout
* Forgot Password
* OTP Verification
* Password Reset

### PDF Handling

* Upload PDF Documents
* Preview PDFs Before Signing
* View Multi-Page PDFs
* Download Signed PDFs

### Signature Management

* Draw Signature
* Upload Signature
* Place Signatures Anywhere on PDF Pages
* Resize and Position Signatures
* Save Signature Coordinates

### State Management

Redux Toolkit is used for:

* Authentication State
* User Information
* PDF Data
* Application State Management

## Project Structure

```text
frontend/
├── app/
├── components/
├── redux/
├── services/
├── hooks/
├── public/
├── types/
├── utils/
├── next.config.ts
└── package.json
```

## Environment Variables

| Variable                | Description     |
| ----------------------- | --------------- |
| NEXT_PUBLIC_BACKEND_URL | Backend API URL |

## Deployment

The frontend can be deployed on:

* Vercel
* Netlify
* AWS Amplify

Before deployment, update:

```env
NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.com
```

## Security Features

* Protected Routes
* Secure Cookie-Based Authentication
* API Request Validation
* CORS-Protected Backend Communication

## User Workflow

1. Create an account or log in.
2. Upload a PDF document.
3. Add or draw a signature.
4. Place the signature on the desired page.
5. Save and finalize the document.
6. Download the signed PDF or share it securely.

## Author

Akash Kumar

Built to simplify online document signing with a modern and user-friendly experience.

