export function countSubcomments(comment) {
  if (!comment.replies?.data?.children || comment.kind === 'more') {
    return 0;
  }

  return comment.replies?.data?.children.reduce((acc, reply) => {
    return acc + countSubcomments(reply);
  }, 0);
}
