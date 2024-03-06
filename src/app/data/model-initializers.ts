
import { RespPostData, RespAccountData, RespUserData, RespDocumentData, RespTrancheData,ReqBodyGetPosts } from './data-models';

export function createDefaultRespPostData(): RespPostData {
  return {
    id: 0,
    q_num: 0,
    type: 0,
    category: '',
    q_text: '',
    post_by: null, // replace with a default RespUserData object if needed
    date_post: '',
    date_edit: '',
    attachments: [],
    account: createDefaultRespAccountData(),
    // optional properties are not required to be set
  };
}

export function createDefaultRespTrancheData(): RespTrancheData {
    return {
        id: 0,
        name: '',
    };
  }
  
  export function createDefaultRespAccountData(): RespAccountData {
    return {
      id: '',
      no: 0,
      name: '',
      tranche: createDefaultRespTrancheData(), // Initialize the tranche property
    };
  }

  export function initReqBodyGetPosts(): ReqBodyGetPosts {
    return {
      search: '',      // Initialize to empty string or any default value
      tranche: '',     // Initialize to empty string or any default value
      account: null,   // Initialize to null or any default value
      id: null,        // Initialize to null or any default value
      post_by: null,   // Initialize to null or any default value
      date_from: '',   // Initialize to empty string or any default value
      date_to: '',     // Initialize to empty string or any default value
      has_answer: null,// Initialize to null or any default value
      approved: null,  // Initialize to null or any default value
      type: '',        // Initialize to empty string or any default value
      category: ''     // Initialize to empty string or any default value
    };
  }