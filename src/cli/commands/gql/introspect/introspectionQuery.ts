export const INTROSPECTION_QUERY = `
{
	__schema {
		types {
			kind
			name
			description
			fields(includeDeprecated: true) {
				name
				description
				isDeprecated
				deprecationReason
				type {
					kind
					name
					description
					ofType {
						kind
						name
						description
						ofType {
							kind
							name
							description
							ofType {
								kind
								name
								description
								ofType {
									kind
									name
									description
									ofType {
										kind
										name
										description
										ofType {
											kind
											name
											description
											ofType {
												kind
												name
												description
											}
										}
									}
								}
							}
						}
					}
				}
				args {
					name
					description
					type {
						kind
						name
						description
						ofType {
							kind
							name
							description
							ofType {
								kind
								name
								description
								ofType {
									kind
									name
									description
									ofType {
										kind
										name
										description
										ofType {
											kind
											name
											description
											ofType {
												kind
												name
												description
												ofType {
													kind
													name
													description
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
			interfaces {
				kind
				name
				description
				ofType {
					kind
					name
					description
					ofType {
						kind
						name
						description
						ofType {
							kind
							name
							description
							ofType {
								kind
								name
								description
								ofType {
									kind
									name
									description
									ofType {
										kind
										name
										description
										ofType {
											kind
											name
											description
										}
									}
								}
							}
						}
					}
				}
			}
			possibleTypes {
				kind
				name
				description
				ofType {
					kind
					name
					description
					ofType {
						kind
						name
						description
						ofType {
							kind
							name
							description
							ofType {
								kind
								name
								description
								ofType {
									kind
									name
									description
									ofType {
										kind
										name
										description
										ofType {
											kind
											name
											description
										}
									}
								}
							}
						}
					}
				}
			}
			enumValues(includeDeprecated: true) {
				name
				description
			}
			inputFields {
				name
				description
				type {
					kind
					name
					description
					ofType {
						kind
						name
						description
						ofType {
							kind
							name
							description
							ofType {
								kind
								name
								description
								ofType {
									kind
									name
									description
									ofType {
										kind
										name
										description
										ofType {
											kind
											name
											description
											ofType {
												kind
												name
												description
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
		subscriptionType {
			name
			description
		}
		directives {
			name
			description
			locations
			args {
				name
				description
				type {
					kind
					name
					description
					ofType {
						kind
						name
						description
						ofType {
							kind
							name
							description
							ofType {
								kind
								name
								description
								ofType {
									kind
									name
									description
									ofType {
										kind
										name
										description
										ofType {
											kind
											name
											description
											ofType {
												kind
												name
												description
											}
										}
									}
								}
							}
						}
					}
				}
				defaultValue
			}
		}

# 		Blacklisted
# 		mutationType {}
# 		queryType {}
	}
}
`
