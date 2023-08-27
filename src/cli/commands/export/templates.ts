import { getDateUnix, getId, getSortKey } from "@/cli/commands/export/utils"

type ExtraData = Record<string, unknown>

type Resource = {
	_id: string
}

function createWorkspaceBase() {
	return {
		_id: `wrk_${getId()}`,
		parentId: null,
		modified: getDateUnix(),
		created: getDateUnix(),
		name: "Generated",
		description: "",
		scope: "collection",
		_type: "workspace" as const,
	}
}

type WorkspaceBase = ReturnType<typeof createWorkspaceBase>

export function createWorkspace(data: Partial<WorkspaceBase> & ExtraData = {}) {
	return {
		...createWorkspaceBase(),
		...data,
	}
}

function createEnvironmentBase(parent: Resource) {
	return {
		_id: `env_${getId()}`,
		parentId: parent._id,
		modified: getDateUnix(),
		created: getDateUnix(),
		name: "School21",
		data: {
			schoolid: "",
		},
		dataPropertyOrder: {
			"&": ["schoolid"],
		},
		color: null,
		isPrivate: false,
		metaSortKey: -getSortKey(),
		_type: "environment" as const,
	}
}

type EnvironmentBase = ReturnType<typeof createEnvironmentBase>

export function createEnvironment(
	parent: Resource,
	data: Partial<EnvironmentBase> & ExtraData = {},
) {
	return {
		...createEnvironmentBase(parent),
		...data,
	}
}

function createOAuth2Base() {
	return {
		type: "oauth2",
		grantType: "authorization_code",
		accessTokenUrl:
			"https://auth.sberclass.ru/auth/realms/EduPowerKeycloak/protocol/openid-connect/token",
		authorizationUrl:
			"https://auth.sberclass.ru/auth/realms/EduPowerKeycloak/protocol/openid-connect/auth",
		clientId: "school21",
		redirectUrl: "https://edu.21-school.ru/",
		scope: "openid profile email",
		credentialsInBody: false,
		disabled: false,
	}
}

type OAuth2Base = ReturnType<typeof createOAuth2Base>

export function createOauth2(data: Partial<OAuth2Base> = {}) {
	return {
		...createOAuth2Base(),
		...data,
	}
}

function createRequestBase() {
	return {
		_id: `req_${getId()}`,
		modified: getDateUnix(),
		created: getDateUnix(),
		method: "POST",
		metaSortKey: getSortKey(),
		isPrivate: false,
		settingStoreCookies: true,
		settingSendCookies: true,
		settingDisableRenderRequestBody: false,
		settingEncodeUrl: true,
		settingRebuildPath: true,
		parameters: [],
		settingFollowRedirects: "global",
		_type: "request" as const,
		authentication: createOauth2(),
	}
}

type RequestBase = ReturnType<typeof createRequestBase>

export function createRequest(data: Partial<RequestBase> & ExtraData = {}) {
	return {
		...createRequestBase(),
		...data,
	}
}

export function createCollection(resources: Resource[] = []) {
	return {
		_type: "export" as const,
		__export_format: 4,
		__export_date: new Date().toISOString(),
		__export_source: "insomnia.desktop.app:v2023.4.0",
		resources,
	}
}
