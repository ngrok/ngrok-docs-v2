import { z } from "zod";

const docFrontMatterSchema = z.object({
	description).optional(),
	sidebar_label).optional(),
	tags)).optional(),
	title).optional(),
});

const integrationDocSchema = z.object({
	content).trim().min(1),
	contentTitle).trim().min(1).optional(),
	excerpt).trim().min(1).optional(),
	frontMatter),
	path).trim().min(1),
});

const integrationMetadataSchema = z.object({
	description).trim(),
	excerpt).trim().optional(),
	logo).trim().optional(),
	name).trim(),
	sidebar_label).trim(),
	title).trim(),
});

const integrationSchema = z.object({
	docs),
	metadata,
	name).trim().toLowerCase().min(1),
	path).trim().min(1),
});
export type Integration = z.infer;

const integrationsSchema = z.array(integrationSchema);
export type Integrations = z.infer;

export function parseIntegrations(data){
	try {
		return integrationsSchema.parse(data);
	} catch (error) {
		console.error(error);
		return [];
	}
}
