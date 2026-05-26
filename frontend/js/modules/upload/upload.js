const input = document.getElementById('imageInput');

input.addEventListener('change', (e) => {
  const file = e.target.files[0];

  if(file) {
    console.log(file.name);
  }
});