
export interface ReqBodyLogin {
	email: string,
	password: string,
}

export interface ReqBodyCreateProject {
	name: string,
	company: string,
	date_start: string,
	date_end: string,
	tranches: string,
}
export interface ReqBodyEditProject {
	name?: string,
	display_name?: string,
	company?: string,
	description?: string,
	
	date_end?: string,
	
	url_logo?: string,
	url_banner?: string,
}

export interface ReqBodyCreateTranche {
	name: string,
}
export interface ReqBodyEditTranche {
	name?: string,
}

export interface ReqBodyCreateUser {
	email: string,
	name: string,
	company?: string,
	tranches?: string[],
	staff?: boolean,
}

export interface ReqBodyAddNote {
	text: string,
	description: string,
	category?: string,
	sticky?: boolean,
}

export interface ReqBodyCreateAccount {
	tranche: string,
	number: number,
	name: string,
}
export interface ReqBodyEditAccount {
	tranche?: string,
	number?: number,
	name?: string,
}

export interface ReqBodyGetPosts {
	search?: string,		// Search term
	tranche?: string,		// Search in specific tranche

	account?: number,		// Filter by account, [type] must be "account"
	id?: number,			// Filter by question ID
	
	post_by?: number,		// Filter by poster ID
	
	date_from?: string,		// Filter by date
	date_to?: string,
	
	has_answer?: boolean,
	approved?: boolean,

	type?: string,
	category?: string,
	
}
export interface QuestionExcelUser{
	Tranche?: string,		

	Account_Number?: string,		
	id?: number,			
	
	Date_Answered		// Filter by poster ID
	
	Date_Posted?: string,		// Filter by date
	
	Is_Answered?: boolean,
	Question: string,
	Answer: string,
	PDF_Attached?: number,
	Question_Number?: string,

	Question_Type?: string,
	Category?: string,
}
export interface ReqBodyPaginate {
	per_page?: number,		// Count per page
	page: number,			// Page number
}
export interface ReqBodyGetPostsWithPaginate {
	filter: ReqBodyGetPosts,
	paginate?: ReqBodyPaginate,
}

export interface ReqBodyCreatePost {
	account?: number,
	
	text: string,
	category?: string,
	
	post_as?: number,
	approve?: boolean,
	
	date_sent?: string,
}
export interface ReqBodySetAnswer {
	id: number,
	text: string,
}
export interface ReqBodyEditPost {
	id: number,
	q_text?: string,
	a_text?: string,
	category?: string,
}

export interface ReqBodySetApproval {
	approve: boolean,
	questions: number[],
}

export interface ReqBodyAddComment {
	id: number,
	text: string,
}
export interface FileUploadDTO {
    questionID: number;
    upType?: string;
    account?: string;
    accountId: number;
}

export interface ReqBodyUploadDocumentWithFile {
	type: string,
	
	with_post?: number,
	with_account?: number,
	
	description?: string,
	
	hidden?: boolean,
	printable?: boolean,
}
/* export interface ReqBodyUploadDocument {
	type: string,
	
	with_post?: number,
	with_account?: number,
	
	name: string,
	description?: string,
	
	url?: string,
	
	hidden?: boolean,
	printable?: boolean,
} */

export interface ReqBodyEditDocument {
	id: number,
	name?: string,
	url?: string,
	description?: string,
	hidden?: boolean,
	printable?: boolean,
}
export interface ReqBodyFilterGetDocument {
	search?: string,		// Search term
	category?: string,		// Category, can be "account", "question", or "general" (default)
	
	upload_by?: number,		// Filter by uploader ID
	
	date_from?: string,		// Filter by date
	date_to?: string,
	
	printable?: boolean,
	
	in_post?: number,		// In a specific question
	in_tranche?: string,	// In a specific tranche
	in_account?: number,	// In a specific account
}
export interface ReqBodyGetDocument {
	filter?: ReqBodyFilterGetDocument,
	paginate?: ReqBodyPaginate,
}

// -----------------------------------------------------

export interface RespProjectData {
	id: number,
	name: string,
	display_name: string,
	date_start: string,
	date_end: string,
	
	// -----------------------------
	
	description?: string,
	company?: string,
	url_logo?: string,
	url_banner?: string,
	
	// -----------------------------
	
	tranches?: RespTrancheData[],
}

export interface RespTrancheData {
	id: number,
	name: string,
	
	// -----------------------------

	accounts?: RespAccountData[],
}

export interface RespUserData {
	id: number,
	display_name: string,

	// -----------------------------

	user_name?: string,
	date_created?: string,
	
	// -----------------------------
	
	tranches?: RespTrancheData[],
}

export interface RespPostData {
	id: number,
	q_num: number,
	type: number,
	category: string,

	account?: RespAccountData,

	q_text: string,
	a_text?: string,

	post_by: RespUserData,

	date_post: string,
	date_sent: string,
	date_edit: string,
	date_answered: string,

	attachments: RespDocumentData[],

	// -----------------------------

	answer_by?: RespUserData,
	q_approve_by?: RespUserData,
	a_approve_by?: RespUserData,
	edit_by?: RespUserData,

	date_q_approve?: string,
	date_a_approve?: string,
}
export interface updateQuest {
	id: number,
	q_num: number,
	type: number,
	category: string,

	//account?: RespAccountData,

	q_text: string,
	a_text?: string,

	
}
export interface RespDocumentData {
	id: number,
	name: string,
	date_upload: string,

	// -----------------------------

	url?: string,
	//doc_type?: number,
	hidden?: boolean,
	allow_print?: boolean,

	assoc_post?: number | RespPostData,
	assoc_account?: number | RespAccountData,
	
	// -----------------------------

	description?: string,
	file_type?: string,
	upload_by?: RespUserData,
}

export interface RespCommentData {
	num: number,
	text: string,
	date_post: string,

	// -----------------------------

	post_by?: RespUserData,
}

export interface RespAccountData {
	id: number,
	id_pretty: string,
	no: number,
	name: string,
	
	// -----------------------------
	
	tranche: RespTrancheData,
}
export interface RespNoteData {
	num: number,
	text: string,
	description: string,
	category: string,
	date_post: string,
	sticky: boolean,

	// -----------------------------

	post_by?: RespUserData,
}

// -----------------------------------------------------

export interface RespLoginToken {
	token: string,
	expiration: string,
}

export interface RespBulkUserCreate {
	id: number,
	user: string,
	pass: string,
}

export interface RespGetPost {
	count_total: number,
	posts: RespPostData[],
}

export interface RespTrancheDataEx extends RespTrancheData {
	posts: number[],
}
