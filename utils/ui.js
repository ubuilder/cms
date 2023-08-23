export function reload() {
  // return '$routing.reload()'
  return "$page.reload()";
}

export function navigate(href) {
  return `window.location.href = ${href}`;
}

export function runAction(name, params = {}, after = "{}") {
  return `$post('?${name}', ${params}).then(res => ${after})`;
}

export function openModal(name) {
  return `$modal.open('${name}')`
}

export function closeModal() {
  return "$modal.close()";
}
