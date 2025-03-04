package com.sena.lcdsena.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class emailService {

    @Autowired
    private JavaMailSender javaMailSender;

    public String enviarCorreoBienvenida(String destinatario, String nombre_usuario) {
        try {
            String asunto = "SOLICITUD DE REGISTRO APROBADA";
            String cuerpo = "<!DOCTYPE html>\n" +
            "<html lang=\"en\">\n" +
            "<head>\n" +
            "    <meta charset=\"UTF-8\">\n" +
            "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
            "    <title>Respuesta correo</title>\n" +
            "</head>\n" +
            "<body style=\"font-family: Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 0;\">\n" +
            "    <section style=\"background-color: #f9fafb; padding: 20px;\">\n" +
            "        <div style=\"display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; max-width: 600px; margin: auto;\">\n" +
            "            <div style=\"width: 100%; padding: 30px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);\">\n" +
            "                <h1 style=\"margin-bottom: 10px; font-size: 24px; font-weight: bold; color: #1f2937;\">\n" +
            "                    ¡Hola, [nombre_usuario]!\n" +
            "                </h1>\n" +
            "                <p style=\"font-size: 16px; color: #4b5563; margin: 10px 0;\">Queremos informarle que su solicitud de registro en nuestra plataforma ha sido aprobada. \n" +
            "                    Si deseas ingresar, aquí te proporcionamos el enlace correspondiente para que inicies sesión en la plataforma.</p>\n" +
            "                <a href=\"http://127.0.0.1:5501/Front-end/index.html\" style=\"color: #39A800; text-decoration: underline; font-weight: 500; font-size: 14px;\">http://127.0.0.1:5501/Front-end/index.html</a>\n" +
            "                <p style=\"font-size: 16px; color: #4b5563; margin: 10px 0;\">Recuerda no compartir tus credenciales, mantén tu cuenta segura para evitar posibles ataques y \n" +
            "                    obtener una mayor seguridad de tus datos.</p>\n" +
            "                <p style=\"font-size: 16px; font-weight: bold; color: #1f2937; margin: 10px 0;\">¡Que tengas un excelente día! 😊</p>\n" +
            "                <a href=\"/Front-end/index.html\" style=\"display: flex; align-items: center; margin-bottom: 20px; font-size: 24px; font-weight: 600; color: #1f2937;\">\n" +
            "                    <img src=\"https://i.ibb.co/4ZY46W6j/LCD-removebg-2.png\" alt=\"logo\" style=\"width: 90px; margin-right: 10px; margin-top: 25px;\">\n" +
            "                </a>\n" +
            "                <hr>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "    </section>\n" +
            "</body>\n" +
            "</html>";
            
            var retorno = enviarCorreo(destinatario, asunto, cuerpo);
            if (retorno) {
                return "se envió correctamente";
            } else {
                return "No se pudo envíar";
            }

        } catch (Exception e) {
            return "Error al envíar " + e.getMessage();
        }
    }

    public String enviarNotificacionRestablecerContra(String destinatario, String enlace) {
        try {
            String asunto = "RESTABLECIMIENTO DE CONTRASEÑA LCDSena";
            String cuerpo = "<!DOCTYPE html>\r\n"
            + "<html lang=\"en\">\r\n"
            + "<head>\r\n"
            + "    <meta charset=\"UTF-8\">\r\n"
            + "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n"
            + "    <title>Correo Olvidar contraseña</title>\r\n"
            + "</head>\r\n"
            + "<body style=\"font-family: Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 0;\">\r\n"
            + "    <section style=\"background-color: #f9fafb; padding: 20px;\">\r\n"
            + "        <div style=\"display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; max-width: 600px; margin: auto;\">\r\n"
            + "            <div style=\"width: 100%; padding: 30px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);\">\r\n"
            + "                <h1 style=\"margin-bottom: 10px; font-size: 24px; font-weight: bold; color: #1f2937;\">\r\n"
            + "                    ¡Hola, [nombre_usuario]!\r\n"
            + "                </h1>\r\n"
            + "                <p style=\"font-size: 16px; color: #4b5563; margin: 10px 0;\">Hemos recibido una solicitud para restablecer tu contraseña. \r\n"
            + "                    ¿Fuiste tú quien realizó esta acción? Si es así, haz clic en el botón de abajo para restablecerla. \r\n"
            + "                    Si no reconoces esta acción, por favor ignora este mensaje. Este enlace es válido por 15 minutos.</p>\r\n"
            + "                <br>\r\n"
            + "                <a href=\"" + enlace
            + "\" style=\"display: inline-block; width: 100%; text-align: center; text-decoration: none; color: white; background-color: #39A800; padding: 10px; border-radius: 5px; font-weight: medium;\">Restablecer</a>\r\n"
            + "                <p style=\"font-size: 16px; color: #4b5563; margin: 10px 0; margin-top: 25px;\">Recuerda mantener tu cuenta segura y nunca compartir tu contraseña.</p>\r\n"
            + "                <p style=\"font-size: 16px; font-weight: bold; color: #1f2937; margin: 10px 0;\">¡Que tengas un excelente día!</p>\r\n"
            + "                <br>\r\n"
            + "                <a href=\"/Front-end/index.html\" style=\"display: flex; align-items: center; margin-bottom: 20px; font-size: 24px; font-weight: 600; color: #1f2937;\">\r\n"
            + "                    <img src=\"https://i.ibb.co/4ZY46W6j/LCD-removebg-2.png\" alt=\"logo\" style=\"width: 90px; margin-right: 10px; margin-top: 25px;\">\r\n"
            + "                </a>\r\n"
            + "                <hr>\r\n"
            + "            </div>\r\n"
            + "        </div>\r\n"
            + "    </section>\r\n"
            + "</body>\r\n"
            + "</html>";

            var retorno = enviarCorreo(destinatario, asunto, cuerpo);
            if (retorno) {
                return "Se envió correctamente";
            } else {
                return "No se pudo enviar";
            }

        } catch (Exception e) {
            return "Error al enviar: " + e.getMessage();
        }
    }

    public boolean enviarCorreo(String destinatario, String asunto, String cuerpo) throws MessagingException {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(destinatario);
            helper.setSubject(asunto);
            helper.setText(cuerpo, true);

            javaMailSender.send(message);
            return true;
        } catch (Exception e) {

            return false;
        }

    }
}
