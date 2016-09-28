/**
 * Internal dependencies
 */
import {
	EDITOR_EMBED_REVERSAL_QUEUE,
	EDITOR_EMBED_REVERSAL_PENDING_REMOVE,
	EDITOR_POST_ID_SET,
	EDITOR_SHOW_DRAFTS_TOGGLE
} from 'state/action-types';

/**
 * Returns an action object to be used in signalling that the editor should
 * begin to edit the post with the specified post ID, or `null` as a new post.
 *
 * @param  {?Number} postId Post ID
 * @return {Object}         Action object
 */
export function setEditorPostId( postId ) {
	return {
		type: EDITOR_POST_ID_SET,
		postId
	};
}

/**
 * Returns an action object to be used in signalling that the editor draft
 * drawer visibility state should be toggled.
 *
 * @return {Object} Action object
 */
export function toggleEditorDraftsVisible() {
	return {
		type: EDITOR_SHOW_DRAFTS_TOGGLE
	};
}

export function queueEditorEmbedReversal( markup ) {
	return {
		type: EDITOR_EMBED_REVERSAL_QUEUE,
		markup
	};
}

export function removePendingEditorEmbedReversal( markup ) {
	return {
		type: EDITOR_EMBED_REVERSAL_PENDING_REMOVE,
		markup
	};
}
