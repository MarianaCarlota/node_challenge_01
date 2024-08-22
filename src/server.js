const server = http.createServer(async (req, res) =>{
  const { method, url } = req;

  await json(req, res);

  const route = routes.find(route => {
    return route.method === method && route.path.test(url);
  })
})

server.listen(3333);