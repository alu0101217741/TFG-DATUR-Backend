import { PackageFormat } from '../../src/utils/types/PackageFormat'

export const FAKE_FIRST_PACKAGE: PackageFormat = {
  help: 'fake-help',
  success: true,
  result: {
    author: 'fake-author',
    author_email: 'fake-author-email',
    creator_user_id: 'fake-creator-user-id',
    id: 'fake-id',
    isopen: true,
    license_id: 'fake-license-id',
    license_title: 'fake-license-title',
    license_url: 'fake-license-url',
    maintainer: 'fake-maintainer',
    maintainer_email: 'fake-maintainer-email',
    metadata_created: 'fake-metadata-created',
    metadata_modified: 'fake-metadata-modified',
    name: 'fake-name',
    notes: 'fake-notes',
    num_resources: 1,
    num_tags: 1,
    organization: {
      id: 'fake-id',
      name: 'fake-name',
      title: 'fake-title',
      type: 'fake-type',
      description: '',
      image_url: 'fake-image-url',
      created: 'fake-created',
      is_organization: true,
      approval_status: 'fake-approval-status',
      state: 'fake-state',
    },
    owner_org: 'fake-owner-org',
    private: false,
    state: 'fake-state',
    title: 'fake-title',
    type: 'dataset',
    url: 'fake-url',
    version: 'fake-version',
    extras: [
      {
        key: 'fake-key',
        value: 'fake-value',
      },
    ],
    groups: [
      {
        description: 'fake-description',
        display_name: 'fake-display-name',
        id: 'fake-id',
        image_display_url: 'fake-image-display-url',
        name: 'fake-name',
        title: 'fake-title',
      },
    ],
    resources: [
      {
        access_url: 'fake-access-url',
        cache_last_updated: 'fake-cache-last-updated',
        cache_url: 'fake-cache-url',
        created: 'fake-created',
        datastore_active: true,
        datastore_contains_all_records_of_source_file: true,
        description: 'fake-description',
        format: 'JSON',
        hash: 'fake-hash',
        id: '3b32e185-bcdf-4320-b1c5-fc352aa94444',
        issued: 'fake-issued',
        last_modified: 'fake-last-modified',
        license: 'fake-license',
        metadata_modified: 'fake-metadata-modified',
        mimetype: 'fake-mimetype',
        mimetype_inner: 'fake-mimetype-inner',
        modified: 'fake-modified',
        name: 'fake-name',
        package_id: 'fake-package-id',
        position: 2,
        resource_type: 'fake-resource-type',
        size: 0,
        state: 'fake-state',
        uri: 'fake-uri',
        url: 'fake-dataset-url',
        url_type: 'fake-url-type',
      },
    ],
    tags: [
      {
        display_name: 'fake-display-name',
        id: 'fake-id',
        name: 'fake-name',
        state: 'fake-state',
        vocabulary_id: 'fake-vocabulary-id',
      },
    ],
    relationships_as_subject: [],
    relationships_as_object: [],
  },
}

export const FAKE_SECOND_PACKAGE: PackageFormat = {
  help: 'fake-help',
  success: true,
  result: {
    author: 'fake-author',
    author_email: 'fake-author-email',
    creator_user_id: 'fake-creator-user-id',
    id: 'fake-id',
    isopen: true,
    license_id: 'fake-license-id',
    license_title: 'fake-license-title',
    license_url: 'fake-license-url',
    maintainer: 'fake-maintainer',
    maintainer_email: 'fake-maintainer-email',
    metadata_created: 'fake-metadata-created',
    metadata_modified: 'fake-metadata-modified',
    name: 'fake-name',
    notes: 'fake-notes',
    num_resources: 1,
    num_tags: 1,
    organization: {
      id: 'fake-id',
      name: 'fake-name',
      title: 'fake-title',
      type: 'fake-type',
      description: '',
      image_url: 'fake-image-url',
      created: 'fake-created',
      is_organization: true,
      approval_status: 'fake-approval-status',
      state: 'fake-state',
    },
    owner_org: 'fake-owner-org',
    private: false,
    state: 'fake-state',
    title: 'fake-title',
    type: 'dataset',
    url: 'fake-url',
    version: 'fake-version',
    extras: [
      {
        key: 'fake-key',
        value: 'fake-value',
      },
    ],
    groups: [
      {
        description: 'fake-description',
        display_name: 'fake-display-name',
        id: 'fake-id',
        image_display_url: 'fake-image-display-url',
        name: 'fake-name',
        title: 'fake-title',
      },
    ],
    resources: [
      {
        access_url: 'fake-access-url',
        cache_last_updated: 'fake-cache-last-updated',
        cache_url: 'fake-cache-url',
        created: 'fake-created',
        datastore_active: true,
        datastore_contains_all_records_of_source_file: true,
        description: 'fake-description',
        format: 'JSON',
        hash: 'fake-hash',
        id: '3b32e185-bcdf-4320-b1c5-fc352aa94444',
        issued: 'fake-issued',
        last_modified: 'fake-last-modified',
        license: 'fake-license',
        metadata_modified: 'fake-metadata-modified',
        mimetype: 'fake-mimetype',
        mimetype_inner: 'fake-mimetype-inner',
        modified: 'fake-modified',
        name: 'fake-name',
        package_id: 'fake-package-id',
        position: 2,
        resource_type: 'fake-resource-type',
        size: 0,
        state: 'fake-state',
        uri: 'fake-uri',
        url: 'fake-second-dataset-url',
        url_type: 'fake-url-type',
      },
    ],
    tags: [
      {
        display_name: 'fake-display-name',
        id: 'fake-id',
        name: 'fake-name',
        state: 'fake-state',
        vocabulary_id: 'fake-vocabulary-id',
      },
    ],
    relationships_as_subject: [],
    relationships_as_object: [],
  },
}
