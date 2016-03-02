ServiceConfiguration.configurations.remove({
    service: "instagram"
  });
  ServiceConfiguration.configurations.insert({
    service: "instagram",
    clientId: "05e8ca9735e04001b3df9aeb55d71852",
    scope:['basic', 'comments', 'likes ', 'public_content'],
    secret: "4ff4c304dc024fea9eb196284f067a80"
  });