# TechSphere IT Academy - Website

The public website of TechSphere IT Academy. Students can browse 12 courses, apply online and pay by Easypaisa, JazzCash or cash. Applications are saved to Firebase and appear in the staff panel.

## Folder structure

    techsphere-academy/
    ├── index.html
    ├── style.css
    ├── script.js
    ├── firebase-config.js      (your Firebase keys go here)
    └── images/payment/         (easypaisa-qr.png, jazzcash-qr.png)

## Features

- 12 career courses with duration and price
- Enroll Now form: full name, mobile number, email, CNIC, date of birth, city, education and goal
- Payment methods: Easypaisa (QR, number and transaction ID), JazzCash (QR, number and transaction ID) and Cash at the academy
- The payment amount is the full course fee shown on the course card
- No special format is required for the mobile number or CNIC (dashes and spaces are optional)
- Application ID and a WhatsApp confirmation link after submitting
- Contact (inquiry) form saved to the database
- Dark and light theme (toggle button in the navbar, the choice is remembered)
- Responsive layout that works on mobile

## Payment QR codes

Download your QR codes from the Easypaisa and JazzCash apps and save them as:

    images/payment/easypaisa-qr.png
    images/payment/jazzcash-qr.png

If a QR image is missing, the form still shows the account number.

## Firebase setup

This site uses the same Firebase project as the other sites (`hasan-mart`). Data is saved in two collections:

- `courseEnrollments` for enrollment applications
- `courseInquiries` for contact form messages

1. Open `firebase-config.js` and replace everything with your config:

        window.FIREBASE_CONFIG = {
          apiKey: "...",
          authDomain: "...",
          projectId: "...",
          storageBucket: "...",
          messagingSenderId: "...",
          appId: "..."
        };

2. In Firebase go to Firestore Database > Rules, paste the rules below (replace STAFF_EMAIL with the staff email) and click Publish:

        rules_version = '2';
        service cloud.firestore {
          match /databases/{database}/documents {
            match /orders/{id} {
              allow create: if true;
              allow read, update: if request.auth != null
                && request.auth.token.email == 'STAFF_EMAIL';
            }
            match /restaurantOrders/{id} {
              allow create: if true;
              allow read, update: if request.auth != null
                && request.auth.token.email == 'STAFF_EMAIL';
            }
            match /courseEnrollments/{id} {
              allow create: if true;
              allow read, update: if request.auth != null
                && request.auth.token.email == 'STAFF_EMAIL';
            }
            match /courseInquiries/{id} {
              allow create: if true;
              allow read, update: if request.auth != null
                && request.auth.token.email == 'STAFF_EMAIL';
            }
          }
        }

3. The GitHub Pages domain (`syedhasanshahqadri-ops.github.io`) must be listed under Authentication > Settings > Authorized domains.

Until Firebase is connected, the forms run in demo mode and the academy will not receive anything.

## Changing details

- Courses, prices and durations: edit the course cards in `index.html`. The fee shown in the payment section is read from the card's price, so keep the format `PKR 18,000`.
- Payment numbers and WhatsApp number: edit the `NUM` and `WA` lines at the top of `script.js`.
- Contact email, phone and campus: edit the Contact section in `index.html`.
- Colours: edit `style.css` (the dark theme rules are at the end of the file).

## Publishing on GitHub Pages

1. Create a repository named `techsphere-academy`.
2. Upload the contents of this folder to the root of the repository.
3. Go to Settings > Pages, choose the `main` branch and the root folder, then save.
4. Your link: `https://syedhasanshahqadri-ops.github.io/techsphere-academy/`

## Privacy notes

- The enrollment form collects personal data, including the CNIC number. Only the staff account listed in the Firestore rules can read it.
- Use a strong staff password and keep the staff panel link private.
- Delete test applications from the Firebase console before going live.# IT-Course-Web
