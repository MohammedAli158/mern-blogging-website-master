# mern-blogging-website-master
This is a blog creating website developed using mern stack and is fully functional and working having working notification system and more
Features: 
Google Authentication: Secure login and signup using Google OAuth.
Image Uploading: Users can upload and manage images within their blogs.
Blog Management: Create, edit, and delete blogs with full CRUD functionality.
Engagement System: Like blogs, comment on them, reply to comments (supports infinite nesting), and remove comments when needed.
User Dashboard: Manage drafts, published blogs, and delete unwanted posts easily.
Search Functionality: Search across blogs and users; results dynamically match the query.
Trending & Tag Filtering: Blogs are ranked and shown as trending based on engagement (likes, comments, replies). Users can also filter blogs by tags.
Similar Blogs Section: Displays related blogs below each blog post to enhance discoverability.
Notifications: Real-time notifications for new comments, likes, and replies, accessible via the dashboard or the navbar notification icon.
Clean, organized, and built for a smooth user experience.

#the directory structure used
```
├── .gitignore
├── blogging
│   ├── Readme.md
│   ├── blogging-website-frontend
│   │   ├── README.md
│   │   ├── index.html
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── postcss.config.js
│   │   ├── src
│   │   │   ├── App.jsx
│   │   │   ├── common
│   │   │   │   ├── date.jsx
│   │   │   │   ├── firebase.jsx
│   │   │   │   ├── page-animation.jsx
│   │   │   │   └── session.jsx
│   │   │   ├── components
│   │   │   │   ├── about.component.jsx
│   │   │   │   ├── blog-content.component.jsx
│   │   │   │   ├── blog-editor.component.jsx
│   │   │   │   ├── blog-interaction.component.jsx
│   │   │   │   ├── blog-post.component.jsx
│   │   │   │   ├── comment-card.component.jsx
│   │   │   │   ├── comment-field.component.jsx
│   │   │   │   ├── comments.component.jsx
│   │   │   │   ├── inpage-navigation.component.jsx
│   │   │   │   ├── input.component.jsx
│   │   │   │   ├── load-more.component.jsx
│   │   │   │   ├── loader.component.jsx
│   │   │   │   ├── manage-blogcard.component.jsx
│   │   │   │   ├── navbar.component.jsx
│   │   │   │   ├── nobanner-blog-post.component.jsx
│   │   │   │   ├── nodata.component.jsx
│   │   │   │   ├── notification-card.component.jsx
│   │   │   │   ├── notification-comment-field.component.jsx
│   │   │   │   ├── pageArray.component.jsx
│   │   │   │   ├── publish-form.component.jsx
│   │   │   │   ├── sidenavbar.component.jsx
│   │   │   │   ├── tags.component.jsx
│   │   │   │   ├── tools.component.jsx
│   │   │   │   ├── user-navigation.component.jsx
│   │   │   │   └── usercard.component.jsx
│   │   │   ├── imgs
│   │   │   │   ├── 404.png
│   │   │   │   ├── blog banner.png
│   │   │   │   ├── full-logo.png
│   │   │   │   ├── google.png
│   │   │   │   ├── logo.png
│   │   │   │   └── user profile.png
│   │   │   ├── index.css
│   │   │   ├── main.jsx
│   │   │   ├── pages
│   │   │   │   ├── 404.page.jsx
│   │   │   │   ├── blog.page.jsx
│   │   │   │   ├── change-password.page.jsx
│   │   │   │   ├── edit-profile.page.jsx
│   │   │   │   ├── editor.pages.jsx
│   │   │   │   ├── home.page.jsx
│   │   │   │   ├── manage-blogs.page.jsx
│   │   │   │   ├── notifications.page.jsx
│   │   │   │   ├── profile.page.jsx
│   │   │   │   ├── search.page.jsx
│   │   │   │   └── userAuthForm.page.jsx
│   │   │   └── regex.txt
│   │   ├── tailwind.config.js
│   │   └── vite.config.js
│   └── server
│       ├── CommentClass.js
│       ├── Schema
│       │   ├── Blog.js
│       │   ├── Comment.js
│       │   ├── Notification.js
│       │   └── User.js
│       ├── package-lock.json
│       ├── package.json
│       ├── requests.rest
│       └── server.js
├── license.md
└── readme.md ```

