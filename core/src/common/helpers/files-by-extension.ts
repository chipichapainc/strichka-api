import { readdir, lstat } from "fs/promises"
import { existsSync } from "fs"
import * as path from "path"

export const filesByExtension = async (startPath, filter) => {
    if (!existsSync(startPath)) {
        console.log("Dir not found ", startPath);
        return []
    }

    const entries = await readdir(startPath);
    const files: string[] = []
    for (let i = 0; i < entries.length; i++) {
        const filename = path.join(startPath, entries[i]);
        const stat = await lstat(filename);
        if (stat.isDirectory()) {
            const children = await filesByExtension(filename, filter);
            children.forEach(file => files.push(file))
        } else if (filename.endsWith(filter)) {
            files.push(filename)
        };
    };
    return files
};