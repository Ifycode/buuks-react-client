import { PostForm } from "../interfaces/books";

export const fetchOptions = (method: string, form: PostForm) => {
  let options: any;
  options = {
    method: method,
    headers: {
      'Authorization': `Bearer ${localStorage.accessToken}`,
      'x-access-token': `${localStorage.accessToken}`
    }
  }
  if (method === 'POST') {
    let formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('pdf', form.pdf as File);
    options = {
      ...options,
      body: formData
    }
  }
  if (method === 'PUT') {
    let formData = new FormData();
    if (form.title !== '') formData.append('title', form.title);
    if (form.description !== '') formData.append('description', form.description);
    if (form.pdf !== '') formData.append('pdf', form.pdf as File);
    options = {
      ...options,
      body: formData
    }
  }
  return options;
}