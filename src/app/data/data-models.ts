
export interface ReqBodyLogin {
	Email: string,
	Password: string,
}
export interface ReqBodyCreateProject {
	Name: string,
	Company: string,
	DateStart: string,
	DateEnd: string,
	Tranches: string,
}

export interface ReqBodyGetPosts {
	Search?: string,		// Search term
	Tranche?: string,		// Search in specific tranche
	
	TicketID?: number,
	PosterID?: number,
	
	DateFrom?: string,
	DateTo?: string,
	
	Answered?: boolean,
}
export interface ReqBodyPaginate {
	Count?: number,			// Count per page
	Page?: number,			// Page number
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

export interface RespProjectInfo {
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
	
	tranches?: string[],
}
export interface RespUserInfo {
	id: number,
	display_name: string,
	
	// -----------------------------
	
	user_name?: string,
	date_created?: string,
}
export interface RespQuestionInfo {
	q_num: number,
	type: number,
	tranche?: string,
	account?: number,
	
	q_text: string,
	a_text?: string,
	
	post_by: RespUserInfo,
	
	date_post?: string,
	date_edit?: string,
	
	attachments: RespDocumentInfo[],
	
	// -----------------------------
	
	answer_by_id?: number,
	answer_by?: string,
	
	q_approve_by_id?: number,
	q_approve_by?: string,
	a_approve_by_id?: number,
	a_approve_by?: string,
	
	edit_by_id?: number,
	edit_by?: string,
	
	date_q_approve?: string,
	date_a_approve?: string,
}
export interface RespDocumentInfo {
	id: number,
	name: string,
	date_upload: string,
	
	// -----------------------------
	
	url?: string,
	//doc_type?: number,
	hidden?: boolean,
	allow_print?: boolean,
	
	assoc_post?: number,
	assoc_account?: number,
	
	// -----------------------------
	
	description?: string,
	file_type?: string,
	upload_by?: number,
}
export interface RespCommentInfo {
	num: number,
	text: string,
	date_post: string,
	
	// -----------------------------
	
	post_by_id?: number,
	post_by?: string,
}