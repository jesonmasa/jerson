import sys
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import json
import os

def send_email(to_email, subject, html_content, text_content):
    # Credenciales hardcoded (solo porque las variables de entorno fallan en tu entorno actual)
    # EN PRODUCCIÓN DEBERÍAS USAR VARIABLES DE ENTORNO
    sender_email = os.environ.get('EMAIL_USER', 'fonsecakiran@gmail.com')
    sender_password = os.environ.get('EMAIL_PASS', 'tclebejcfxkyodws') # Contraseña sin espacios

    try:
        # Configurar conexión segura
        server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        server.login(sender_email, sender_password)

        # Crear mensaje
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"URA MARKET <{sender_email}>"
        msg["To"] = to_email

        # Adjuntar partes
        part1 = MIMEText(text_content, "plain")
        part2 = MIMEText(html_content, "html")
        msg.attach(part1)
        msg.attach(part2)

        # Enviar
        server.sendmail(sender_email, to_email, msg.as_string())
        server.quit()
        
        print(json.dumps({"success": True, "message": "Email enviado con Python"}))
        return True

    except Exception as e:
        error_msg = str(e)
        print(json.dumps({"success": False, "error": error_msg}))
        return False

if __name__ == "__main__":
    # Leer argumentos desde la línea de comandos
    if len(sys.argv) < 5:
        print(json.dumps({"success": False, "error": "Faltan argumentos"}))
        sys.exit(1)

    to = sys.argv[1]
    subject = sys.argv[2]
    html = sys.argv[3]
    text = sys.argv[4]

    send_email(to, subject, html, text)
