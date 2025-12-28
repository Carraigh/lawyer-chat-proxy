# Используем официальный образ Ollama
FROM ollama/ollama:latest

# Устанавливаем Node.js для прокси-сервера
RUN apt-get update && \
    apt-get install -y curl gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем серверный скрипт
COPY server.js .

# Скачиваем лёгкую модель phi3:mini (около 2.3 ГБ)
RUN ollama pull phi3:mini

# Проверяем, что модель действительно загружена
RUN ollama list

# Говорим Docker, какой порт использовать (хотя Render сам определяет)
EXPOSE 3000

# Запускаем Ollama в фоне, ждём 30 секунд и запускаем Node.js-сервер
CMD ["sh", "-c", "ollama serve & sleep 30 && node server.js"]
