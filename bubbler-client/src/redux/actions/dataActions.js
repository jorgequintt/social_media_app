import {
   SET_BUBBLES,
   LOADING_DATA,
   LIKE_BUBBLE,
   UNLIKE_BUBBLE,
   DELETE_BUBBLE,
   POST_BUBBLE,
   CLEAR_ERRORS,
   LOADING_UI,
   SET_ERRORS,
   SET_BUBBLE,
   STOP_LOADING_UI,
   SUBMIT_COMMENT,
   WIPE_BUBBLES,
} from "../types";
import axios from "axios";

export const getBubble = (bubbleId) => (dispatch) => {
   dispatch({ type: LOADING_UI });
   axios
      .get(`/bubble/${bubbleId}`)
      .then((res) => {
         dispatch({ type: SET_BUBBLE, payload: res.data });
         dispatch({ type: STOP_LOADING_UI });
      })
      .catch((err) => {
         console.log(err);
      });
};

// Get bubbles
export const getBubbles = () => (dispatch) => {
   dispatch({ type: LOADING_DATA });
   dispatch({ type: WIPE_BUBBLES });
   axios
      .get("/bubbles")
      .then((res) => {
         dispatch({
            type: SET_BUBBLES,
            payload: res.data,
         });
      })
      .catch((err) => {
         dispatch({
            type: SET_BUBBLES,
            payload: [],
         });
      });
};

// Get more bubbles
export const getMoreBubbles = (afterDate) => (dispatch) => {
   dispatch({ type: LOADING_DATA });
   axios
      .get("/bubbles", {
         params: {
            after: afterDate,
         },
      })
      .then((res) => {
         dispatch({
            type: SET_BUBBLES,
            payload: res.data,
         });
      })
      .catch((err) => {
         dispatch({
            type: SET_BUBBLES,
            payload: [],
         });
      });
};

export const postBubble = (bubble) => (dispatch) => {
   dispatch({ type: LOADING_UI });
   axios
      .post("/bubble", bubble)
      .then((res) => {
         dispatch({ type: POST_BUBBLE, payload: res.data });
         dispatch({ type: CLEAR_ERRORS });
      })
      .catch((err) => {
         dispatch({ type: SET_ERRORS, payload: err.response.data });
      });
};

export const submitComment = (bubbleId, bubble) => (dispatch) => {
   dispatch({ type: LOADING_UI });
   axios
      .post(`/bubble/${bubbleId}/comment`, bubble)
      .then((res) => {
         dispatch({ type: SUBMIT_COMMENT, payload: res.data });
         dispatch({ type: CLEAR_ERRORS });
      })
      .catch((err) => {
         dispatch({ type: SET_ERRORS, payload: err.response.data });
      });
};

// Like bubble
export const likeBubble = (bubbleId) => (dispatch) => {
   axios
      .post(`/bubble/${bubbleId}/like`)
      .then((res) => {
         dispatch({
            type: LIKE_BUBBLE,
            payload: res.data,
         });
      })
      .catch((err) => {
         console.log(err);
      });
};

// Unlike bubble
export const unlikeBubble = (bubbleId) => (dispatch) => {
   axios
      .post(`/bubble/${bubbleId}/unlike`)
      .then((res) => {
         dispatch({
            type: UNLIKE_BUBBLE,
            payload: res.data,
         });
      })
      .catch((err) => {
         console.log(err);
      });
};

export const deleteBubble = (bubbleId) => (dispatch) => {
   axios
      .delete(`/bubble/${bubbleId}`)
      .then((err) => {
         dispatch({
            type: DELETE_BUBBLE,
            payload: bubbleId,
         });
      })
      .catch((err) => {
         console.log(err);
      });
};

export const getUserData = (userName) => (dispatch) => {
   dispatch({ type: WIPE_BUBBLES });
   dispatch({ type: LOADING_DATA });
   axios
      .get(`/user/${userName}`)
      .then((res) => {
         dispatch({ type: SET_BUBBLES, payload: res.data.bubbles });
      })
      .catch((err) => {
         dispatch({ type: SET_BUBBLES, payload: null });
      });
};
