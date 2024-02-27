
import { RespPostData, RespAccountData, RespUserData, RespDocumentData, RespTrancheData } from './data-models';

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
      id: 0,
      no: 0,
      name: '',
      tranche: createDefaultRespTrancheData(), // Initialize the tranche property
    };
  }