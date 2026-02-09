export declare function getAllForm(): Promise<any>;
export declare function getFormByFormName(formName: string): Promise<any>;
export declare function getFormById(id: number): Promise<any>;
export declare function addForm(formData: any): Promise<any>;
export declare function deleteFormById(id: number): Promise<{
    message: string;
}>;
export declare function updateForm(formData: any): Promise<any>;
