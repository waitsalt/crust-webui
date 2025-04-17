addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // 定义要代理的目标网站
  const targetUrl = 'https://pin.crustcode.com'

  // 获取原始请求的路径和查询参数
  const url = new URL(request.url)
  const path = url.pathname
  const query = url.search

  const headers = new Headers(request.headers)
  headers.delete('origin')
  headers.delete('referer')

  // 构建新的请求
  const proxyRequest = new Request(targetUrl + path + query, {
    method: request.method,
    headers: headers,
    body: request.body
  })

  try {
    // 转发请求到目标网站
    const response = await fetch(proxyRequest)

    // 可选：修改响应头
    const modifiedHeaders = new Headers(response.headers)
    modifiedHeaders.set('Access-Control-Allow-Origin', '*')
    modifiedHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    modifiedHeaders.set('Access-Control-Allow-Headers', '*')

    // 返回修改后的响应
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: modifiedHeaders
    })
  } catch (error) {
    // 错误处理
    return new Response('Proxy error: ' + error.message, {
      status: 500
    })
  }
}
