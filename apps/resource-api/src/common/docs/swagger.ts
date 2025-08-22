import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function swagger(app: NestExpressApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Backend de recursos do desafio .Demarco')
    .setDescription(
      `A aplicação backend é responsável por gerenciar recursos do desafio Demarco, incluindo usuários, cadastro de atestados e pesquisa por CIDs. `,
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);
}
