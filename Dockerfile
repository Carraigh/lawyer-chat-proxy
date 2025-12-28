# Используем официальный образ Ollama
FROM ollama/ollama:latest

# Устанавливаем Node.js для нашего прокси
RUN apt-get update && \
    apt-get install -y curl gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# Создаём рабочую директорию
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем сервер
COPY server.js .

# Скачиваем модель при сборке (это может занять 2–5 минут при деплое)
RUN ollama pull phi3:mini

# Порт для нашего прокси
EXPOSE 3000

# Запускаем Ollama в фоне и наш сервер
CMD ["sh", "-c", "ollama serve & sleep 5 && node server.js"]
