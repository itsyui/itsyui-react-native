
declare enum PropertyType {
	STRING = "string",
	INTEGER = "integer",
	DATETIME = "datetime",
	BOOLEAN = "boolean",
	LOOKUP = "lookup"
}

export interface IFormControlSchema {
	name: string;
	properties: IFormControlSchemaProperties;
}

interface IFormControlSchemaProperties {
	"ui:widget": string;
	typeId: string;
	controlID?: string;
	fromSchemaId?: string;
	formSchema?: IFormSchema;
	queryParams?: {};
	isModal?: boolean;
	record?: {};
	objectId?: string;
	dataSource?: string | any;
	extraParams?: {};
	readonly?: boolean;
	formHeader?: string;
}

interface IFormSchema {
	id?: string;
	displayName?: string;
	propertyDefinitions: IFormSchemaPropertyDefinitions;
	sections?: any[];
}

interface IFormSchemaPropertyDefinitions {
	[fieldId: string]: IFormSchemaPropertyDefinitionsValues;
}

interface IFormSchemaPropertyDefinitionsValues {
	id: string;
	displayName: string;
	propertyType: PropertyType;
	placeholderText?: string;
	"ui:widget": string;
	required?: boolean;
	validationPattern?: string;
}