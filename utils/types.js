/**
 * Page
 * @typedef {Object} Page
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} head
 * @property {string} slot_id
 * @property {Instance | undefined} slot
 * @property {boolean} is_template
*/

/**
 * Instance
 * @typedef {Object} Instance
 * @property {string} id
 * @property {string} component_id
 * @property {Instance | undefined} parent
 * @property {Component | undefined} component
 * @property {string[]} slot_ids
 * @property {Instance[] | undefined} slots
*/

/**
 * Component
 * @typedef {Object} Component
 * @property {string} id
 * @property {string} name
 * @property {string} slot_id
 * @property {Instance | undefined} slot
*/
