import { readFile, writeFile } from 'node:fs/promises';
import readlineSync from 'readline-sync';
import bcrypt from 'bcrypt';

const FILE_PATH = './password.txt';
const SALT_ROUNDS = 10;

async function main() {
    try {
        const password = readlineSync.question('Введіть пароль: ', { hideEchoBack: true });

        if (!password) {
            console.log('Пароль не може бути порожнім!');
            return;
        }

        let storedHash = '';

        try {
            const data = await readFile(FILE_PATH, 'utf8');
            storedHash = data.trim();
        } catch (err) {
        }

        if (!storedHash) {
            console.log('Створюємо новий пароль');
            
            const hash = await bcrypt.hash(password, SALT_ROUNDS);
            
            await writeFile(FILE_PATH, hash);
            console.log('Новий пароль успішно збережено!');
        } else {
            console.log('Пароль знайдено. Перевіряємо...');
            
            const isMatch = await bcrypt.compare(password, storedHash);
            
            if (isMatch) {
                console.log('Паролі збігаються!');
            } else {
                console.log('Неправильний пароль!');
            }
        }
    } catch (error) {
        console.error('Error', error.message);
    }
}

main();
