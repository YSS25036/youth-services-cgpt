# ✨ Youth Services IMS – VIBE Planning Notes

_This markdown captures module ideas, CSV structures, pending items, and spiritual reflections during development._

---

## ✅ To-Do Checklist

- [ ] Do beautification changes to make the application UI look slick and nice
- [ ] Add age group filter to EventDashboard
- [ ] Create CSV template for Event Attendance
- [ ] Fix tag-based search for skills
- [ ] Refactor Layout component (sidebar + header)
- [ ] Generate a Design document with the Tech Stack used for this feature, keep it upto date

---
## Coding and Design Guidelines
- Include inline comments in the code to explain what each section does
- Since I am vibe coding, it will be atleast helpful what each section of code does so that I confidently modify in future
- Whenever suggesting new code, make sure it is always on top of the latest code. Ask, if you dont have latest code files
- Regression: Strictly avoid taking away features or capabilities while suggesting new code or without informing me
- Generate a Design diagram and the Tech Stack for this feature

## UI Design Guidelines
- I like the Tiles a.k.a cards approach, looks neat and slick
- home page can start with a bunch of tiles - Volunteers, Events, Resources, etc.
- The title "Youth Services IMS" should be a banner that is visible in all pages
- Breadcrumbs can indicate which page the user is on
- The logout button can be on the top right
- Bottom most section can be a list of links to various resources
	- link to Yogoda Satsanga Society of India home page
	- Home page of this portal
- Pagination or a lazy load wherever the UI has more than a page to display
  

## 📋 CSV Template: Event Attendance

#```
#eventName,eventDate,volunteerName,status,remarks
#Online Teen Satsanga,01-11-2025,Ajay Madan,Present,—
#```

---

## 🧱 New Module Ideas

- Role Based Access (Administrator, Portal user, YS Core Member)
- An API look up to the Parent Organization (Yogoda Satsanga Society of India) IT system to look up lesson number based on phone number
- An API look up to the Parent Organization (Yogoda Satsanga Society of India) IT system to look up phone number based on lesson number
- Document Hub
	- Shows most used and important documents like vision statements, organization structure
	- Links to Google Drive to show document navigator and ability to search for documents
- Ambitious Goal: Ability for each volunteer to come to this portal to get information they need and use it as a self-serve portal


### 📘 Youth Training Tracker
Tracks spiritual or skills training completed by each volunteer.

##**Fields**:
##- volunteerId
##- moduleName
##- completionDate
##- score (optional)
##- certificateURL

---

### 🧘 Satsanga Feedback
#Allow feedback capture after each satsanga.

#**Fields**:
#- eventId
#- volunteerId
#- feedbackText
#- rating (1-5)

---

## 🐞 Known Issues / Debug Notes

- Skills filtering doesn’t work when there are multiple comma-separated tags
- Layout sidebar is not sticky when scrolled
- Form validation missing for Event creation

---

## 🙏 Reflections & Intentions

This IMS is not just a tech system — it’s a sacred tool to bring clarity, unity, efficiency, and joy to Guru’s youth work across India.

Let this be built in the spirit of seva, with simplicity and sincerity.

--

## 📎 Appendix: Useful Links

- Firebase Console: https://console.firebase.google.com
- GitHub Repo: `https://github.com/YSS25036/youth-services-cgpt`


## ✅ Completed Work (as of 2025-08-02)

### ✅ VIBE 0: Setup & Hosting
- Firebase project created and site deployed successfully
- GitHub repo initialized and integrated
- Local development confirmed with Vite + React

### ✅ VIBE 1: Authentication
- Google login integrated using Firebase Authentication
- User session handling implemented
- Login gated access added to main screens

### ✅ VIBE 2: Volunteer Management
- Volunteer data imported via CSV
- Firestore integration confirmed with correct schema
- Admin dashboard built with basic filtering

### ✅ VIBE 3: Event Management
- Event dashboard UI built
- Events saved to Firestore
- Clean layout with reusable layout wrapper component

### ✅ VIBE 4: Core Features & Linking
- Event Details page created with collapsible sections for details, actions, volunteers, and documents.
- Overall Action Tracker page created with filters.
- Actions can be added/edited from both the global tracker and the specific event details page.
- Manual document linking implemented on the Event Details page.
- Department and detailed Role structure designed and implemented in Firestore.

### ✅ VIBE 5: Usability & Dashboard Enhancements
- **Roles:** Created a `RolesManager` page with full Add, Edit, and Delete functionality.
- **Volunteer Assignment:**
    - Revamped the `AssignVolunteers` page with a modal for selecting Departments and Roles.
    - Added the ability to Edit an existing volunteer's assignment.
- **Volunteer Dashboard:**
    - Added a summary stats section (Total, Male/Female, Assigned/Unassigned).
    - Added a filter for "Assigned" and "Unassigned" volunteers.
    - Fixed table column alignment.
- **Event Dashboard:**
    - Added "Volunteers Assigned" and "Open Actions" columns for an at-a-glance summary.
- **Action Tracker:**
    - Added an "Edit" button for existing actions.
    - Upgraded the status filter to be a multi-select checkbox group.
    - Changed the "Related Event" column to show the clickable event name instead of just a link.
- **Event Details Page:**
    - Updated the "Assigned Volunteers" table to include Department and Role columns.
