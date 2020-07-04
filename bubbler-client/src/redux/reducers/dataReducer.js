import {
   SET_BUBBLES,
   WIPE_BUBBLES,
   LIKE_BUBBLE,
   UNLIKE_BUBBLE,
   LOADING_DATA,
   DELETE_BUBBLE,
   POST_BUBBLE,
   SET_BUBBLE,
   SUBMIT_COMMENT,
} from "../types";

const initialState = {
   bubbles: [],
   bubble: {},
   loading: false,
};

export default function (state = initialState, action) {
   let index;
   switch (action.type) {
      case LOADING_DATA:
         return {
            ...state,
            loading: true,
         };
      case SET_BUBBLE:
         state.bubble = action.payload;
         return state;

      case WIPE_BUBBLES:
         state.bubbles = [];
         return {
            ...state,
         };

      case SET_BUBBLES:
         return {
            ...state,
            bubbles: [...state.bubbles, ...action.payload],
            loading: false,
         };

      case LIKE_BUBBLE:
      case UNLIKE_BUBBLE:
         index = state.bubbles.findIndex(
            (bubble) => bubble.bubbleId === action.payload.bubbleId
         );
         state.bubbles[index] = action.payload;
         if (state.bubble.bubbleId === action.payload.bubbleId) {
            state.bubble = {
               ...state.bubble,
               likeCount: action.payload.likeCount,
            };
         }
         return {
            ...state,
            bubbles: [...state.bubbles],
            bubble: { ...state.bubble },
         };

      case DELETE_BUBBLE:
         index = state.bubbles.findIndex(
            (bubble) => bubble.bubbleId === action.payload
         );
         state.bubbles.splice(index, 1);
         return {
            ...state,
         };
      case POST_BUBBLE:
         return {
            ...state,
            bubbles: [action.payload, ...state.bubbles],
         };

      case SUBMIT_COMMENT:
         // index = state.bubbles.findIndex(
         //    (bubble) => bubble.bubbleId === action.payload.bubbleId
         // );
         // state.bubbles[index].commentCount = {
         //    ...state.bubbles[index],
         //    commentCount: state.bubbles[index].commentCount + 1,
         // };
         return {
            ...state,
            bubbles: [...state.bubbles].map((bubble) => {
               if (bubble.bubbleId === action.payload.bubbleId) {
                  return {
                     ...bubble,
                     commentCount: bubble.commentCount + 1,
                  };
               }
               return bubble;
            }),
            bubble: {
               ...state.bubble,
               commentCount: state.bubble.commentCount + 1,
               comments: [action.payload, ...state.bubble.comments],
            },
         };

      default:
         return state;
   }
}
