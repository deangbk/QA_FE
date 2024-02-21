
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
export interface ReqBodyPaginate {
	per_page: number,		// Count per page
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
}
export interface ReqBodySetAnswer {
	text: string,
}
export interface ReqBodyEditPost {
	text: string,
	category?: string,
}

export interface ReqBodySetApproval {
	approve: boolean,
	questions: number[],
}

export interface ReqBodyAddComment {
	text: string,
}

export interface ReqBodyUploadDocument {
	Url: string,
	Description?: string,
	Hidden?: boolean,
	Printable?: boolean,
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
}

export interface RespUserData {
	id: number,
	display_name: string,

	// -----------------------------

	user_name?: string,
	date_created?: string,
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
	date_edit: string,

	attachments: RespDocumentData[],

	// -----------------------------

	answer_by?: RespUserData,
	q_approve_by?: RespUserData,
	a_approve_by?: RespUserData,
	edit_by?: RespUserData,

	date_q_approve?: string,
	date_a_approve?: string,
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
	no: number,
	name: string,
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
