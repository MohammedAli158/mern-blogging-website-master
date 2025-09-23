class CommentInterface {
  constructor({ comment_id, comment_content, commented_at, commented_by,children }) {
    this.comment_id = comment_id
    this.comment_content = comment_content
    this.commented_at = commented_at 
    this.commented_by = {
      profile_img: commented_by.profile_img,
      username: commented_by.username,
      fullname: commented_by.fullname
    }
    this.children = children.map(child => new CommentInterface(child))
  }
}
export default CommentInterface

