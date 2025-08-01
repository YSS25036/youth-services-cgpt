# ✨ Youth Services IMS – VIBE Planning Notes

_This markdown captures module ideas, CSV structures, pending items, and spiritual reflections during development._

---

## ✅ To-Do Checklist

- [x]  Create a Event Details page that contains multiple collapsible section
		- One is the basic Event Details
		- Second is the Action Tracker against the event
		- Third is all related documents for it (linking to a Google drive that has documents)
- [x ] Create an Action Tracker that is overall and specific to Events
		- Action Tracker fields (Action Owner, Date Assigned, Due Date, Description of Action, Status of Action (In progress, completed, suspended, Yet to Start, Not Applicable)
		The link to Tracker should be on the Home Page
		- Each Event has to have actions specific to it and displayed in the Event Details page
		- Actions can be further filtered by Name, Due Date
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

- Departments need to be created. The department values are
	- Communications & Outreach
	- Volunteer coordination
	- Programs & Operations
	- YS Support for Centers,Online
	- Training & Content

- There are many roles, that are mapped to department. Following are the entries for Roles:
	Role Name
	Role Category 	
	Roles & Responsibilities (string)	
	Preferred Skills (independent tags that allows multi-select & search)	
	Time commitment needed (days per week)	
	Comments (string)

- On the Volunteers page, right on top display a summary of all Volunteers and show a breakup side by side count of men & women 
- A form with relevant fields to add a new volunteer
- A page to enumerate all relevant skills of volunteers, this is like a master database of skills
- Role Based Access (Administrator, Portal user, YS Core Member)
- An API look up to the Parent Organization (Yogoda Satsanga Society of India) IT system to look up lesson number based on phone number
- An API look up to the Parent Organization (Yogoda Satsanga Society of India) IT system to look up phone number based on lesson number 
- Like Skills, maintain a Roles Database that can be assigned to different volunteers like the following - 
	- Facilitator
	- Asst. Facilitator
	- Trainer
	- Group Discussion Leader
	- Group Leader
	- Writer 
	- IT Ops
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


## ✅ Completed Work (as of 2025-07-28)

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
- Admin dashboard built with:
  - Filtering by city and search
  - Display of all volunteer fields including skills and lesson number

### ✅ VIBE 3: Event Management
- Event dashboard UI built
- Events saved to Firestore
- Clean layout with reusable layout wrapper component

### ✅ VIBE 4.1–4.2: Event Participation Mapping
- UI wireframe generated and approved
- EventParticipation.jsx screen generated
- Data structure finalized for `event_participation` collection

