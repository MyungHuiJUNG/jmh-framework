function removeHtmlTags(content) {
  return content.replace(/<\/?[^>]+(>|$)/g, "");
}

function removeHtmlTagsIncludingImg(content) {
  return content.replace(/<img[^>]*>(.*?)<\/img>|<\/?[^>]+(>|$)/g, "");
}

export default { removeHtmlTags, removeHtmlTagsIncludingImg};
