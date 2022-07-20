import { ServerResource } from './ServerResource'

export type PackageFormat = {
  help: string
  success: boolean
  result: {
    author: string
    author_email: string
    creator_user_id: string
    id: string
    isopen: boolean
    license_id: string
    license_title: string
    license_url: string
    maintainer: string
    maintainer_email: string
    metadata_created: string
    metadata_modified: string
    name: string
    notes: string
    num_resources: number
    num_tags: number
    organization: {
      id: string
      name: string
      title: string
      type: string
      description: string
      image_url: string
      created: string
      is_organization: boolean
      approval_status: string
      state: string
    }
    owner_org: string
    private: boolean
    state: string
    title: string
    type: string
    url: string
    version: string
    extras: [{ key: string; value: string }]
    groups: [
      {
        description: string
        display_name: string
        id: string
        image_display_url: string
        name: string
        title: string
      }
    ]
    resources: ServerResource[]
    tags: [
      {
        display_name: string
        id: string
        name: string
        state: string
        vocabulary_id: string
      }
    ]
    relationships_as_object: []
    relationships_as_subject: []
  }
}
