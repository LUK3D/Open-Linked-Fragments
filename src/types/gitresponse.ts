interface GitResponse{
"status": number,
"url": string,
"headers": {
"access-control-allow-origin": string,
"access-control-expose-headers": string,
"cache-control": string,
"connection": string,
"content-length": string,
"content-security-policy": string,
"content-type": string,
"date": string,
"etag ":string,
"github-authentication-token-expiration": string,
"location": string,
"referrer-policy": string,
"server": string,
"strict-transport-security": string,
"vary": string,
"x-accepted-oauth-scopes": string,
"x-content-type-options": string,
"x-frame-options": string,
"x-github-media-type": string,
"x-github-request-id": string,
"x-oauth-scopes": string,
"x-ratelimit-limit": string,
"x-ratelimit-remaining": string,
"x-ratelimit-reset": string,
"x-ratelimit-resource": string,
"x-ratelimit-used": string,
"x-xss-protection": string
},
"data": {
"id": number,
"node_id": string,
"name": string,
"full_name": string,
"private": boolean,
"owner": {
"login": string,
"id": number,
"node_id": string,
"avatar_url": string,
"gravatar_id": string,
"url": string,
"html_url": string,
"followers_url": string,
"following_url": string,
"gists_url": string,
"starred_url": string,
"subscriptions_url": string,
"organizations_url": string,
"repos_url": string,
"events_url": string,
"received_events_url": string,
"type": string,
"site_admin": boolean
},
"html_url": string,
"description": string,
"fork": boolean,
"url": string,
"forks_url": string,
"keys_url": string,
"collaborators_url": string,
"teams_url": string,
"hooks_url": string,
"issue_events_url": string,
"events_url": string,
"assignees_url": string,
"branches_url": string,
"tags_url": string,
"blobs_url": string,
"git_tags_url": string,
"git_refs_url": string,
"trees_url": string,
"statuses_url": string,
"languages_url": string,
"stargazers_url": string,
"contributors_url": string,
"subscribers_url": string,
"subscription_url": string,
"commits_url": string,
"git_commits_url": string,
"comments_url": string,
"issue_comment_url": string,
"contents_url": string,
"compare_url": string,
"merges_url": string,
"archive_url": string,
"downloads_url": string,
"issues_url": string,
"pulls_url": string,
"milestones_url": string,
"notifications_url": string,
"labels_url": string,
"releases_url": string,
"deployments_url": string,
"created_at": string,
"updated_at": string,
"pushed_at": string,
"git_url": string,
"ssh_url": string,
"clone_url": string,
"svn_url": string,
"homepage": null,
"size": number,
"stargazers_count": number,
"watchers_count": number,
"language": null,
"has_issues": boolean,
"has_projects": boolean,
"has_downloads": boolean,
"has_wiki": boolean,
"has_pages": boolean,
"forks_count": number,
"mirror_url": null,
"archived": boolean,
"disabled": boolean,
"open_issues_count": number,
"license": null,
"allow_forking": boolean,
"is_template": boolean,
"topics": [],
"visibility": string,
"forks": number,
"open_issues": number,
"watchers": number,
"default_branch": string,
"permissions": {
"admin": boolean,
"maintain": boolean,
"push": boolean,
"triage": boolean,
"pull": boolean
},
"allow_squash_merge": boolean,
"allow_merge_commit": boolean,
"allow_rebase_merge": boolean,
"allow_auto_merge": boolean,
"delete_branch_on_merge": boolean,
"allow_update_branch": boolean,
"use_squash_pr_title_as_default": boolean,
"network_count": number,
"subscribers_count": 1
}
}


export{
    GitResponse
}