# Bubbler - A fake social media clone of Twitter

**LIVE VERSION**: https://bubbler-671eb.web.app/

A much simpler but working version of a twitter clone. You can make posts (bubbles), like other people's posts and comment on them.

# Software used
### **Server Side**
  - **Firebase**
    - **Firebase Authentication**
    - **Firestore**: Firebase database. Users, posts, comments and likes are stored here.
    - **Firebase Storage**: Profile pictures are stored here.
    - **Firebase Functions**: Server logic (Node 10). Main packages:
      - **Firebase Tools**: Firebase SDK, to access everything listed above.
      - **Busboy**: For handling and saving image profiles sent by the user.
      - **Sharp**: For cropping, centering and resizing of profile pictures.
      - **Express**: API Routes
      - **Jest**: Automatic endpoint testing
### **Client Side**
  - **React**
  - **Redux**
  - **Axios**
  - **JWT Decode**
      
