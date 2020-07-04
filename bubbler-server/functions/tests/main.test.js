/* -------------------------------------------------------------------------- */
/*                                  API TESTS                                 */
/* -------------------------------------------------------------------------- */
const tokenRegex = /^[A-Za-z0-9-_+=]+\.[A-Za-z0-9-_+=]+\.?[A-Za-z0-9-_.+=]*$/;
let token;
const headers = () => {
   let h = {};
   if (token) h["Authorization"] = `Bearer ${token}`;
   return { headers: h };
};

const axios = require('axios').create({
   baseURL: "http://localhost:5001/bubbler-671eb/us-east1/api"
});

expect.assertions(1)
test("Server should be alive", async () => {
   await axios.get('/ping')
      .then(response => {
         expect(response).toMatchObject({
            data: 'OK',
            status: 200
         });
      })
      .catch()
});


test("Sign up validation: Can't sign up because weak password", async () => {

   const data = {
      email: "mytestuser@faketestdomain.not",
      name: "testuser",
      password: "test",
      confirmPassword: "test"
   };
   await axios.post('/signup', data)
      .then(resp => {
      })
      .catch(err => {
         const resp = err.response;
         expect(resp).toMatchObject({
            status: 400,
            data: { password: "Invalid password" },
         });
      })
});

test("Can sign up", async () => {

   const data = {
      email: "mytestuser@faketestdomain.not",
      name: "testuser",
      password: "testpassword1",
      confirmPassword: "testpassword1"
   };
   await axios.post('/signup', data)
      .then(resp => {
         expect(resp).toMatchObject({
            status: 201,
            token: expect.stringMatching(tokenRegex)
         });
      })
      .catch(err => {
      })
});

test("Can log in", async () => {

   const data = {
      email: "mytestuser@faketestdomain.not",
      password: "testpassword1",
   };
   await axios.post('/login', data)
      .then(resp => {
         token = !!resp.data && resp.data.token;
         expect(resp).toMatchObject({
            status: 200,
            token: expect.stringMatching(tokenRegex)
         });
      })
      .catch(err => {
      })
});

test("Can post bubble with token", async () => {
   if (!token) throw "Can post bubble error: No token";
   const data = {
      body: "Testing bubble 1"
   };

   await axios.post('/bubble', data, headers())
      .then(resp => {
         expect(resp.status).toBe(201);
      }).catch();
});

test("Can't post bubble without token", async () => {
   const data = {
      body: "Testing bubble 2"
   };

   await axios.post('/bubble', data)
      .then(resp => { })
      .catch(err => {
         expect(err.response.status).toBe(403);
      });
});

// This at the end
test('Delete test user from authentication', async () => {
   await axios.delete('/testUser')
      .then(resp => {
         expect(resp.status).toBe(200);
      })
      .catch(err => {
      })
});