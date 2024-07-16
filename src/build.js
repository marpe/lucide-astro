import fs from 'fs/promises'
import Lucide from "lucide-static"

try {
	console.log('deleting the dist folder')
	await fs.rm('./dist', { recursive: true, force: true })
	await fs.mkdir('./dist')

	const template = await fs.readFile('./src/Template.astro', 'utf8')

	function fillTemplate(icon) {
		return template.replace(
			'<!-- icon -->',
			icon.replace(/<svg(?:.|\n)*?>((?:.|\n)*)<\/svg>/gm, '$1').replace(/  /g, '\t').trim(),
		)
	}

	console.log('copying base layout')
	await fs.copyFile('./src/.Layout.astro', './dist/.Layout.astro')

	console.log('creating icons')
	for (const name in Lucide) {
		const icon = Lucide[name]
		const fullName = name.slice(0, 1).toUpperCase() + name.slice(1) + "Icon";
		const filePath = `./dist/${fullName}.astro`;
		await fs.writeFile(filePath, fillTemplate(icon), "utf-8");
	}
	process.exit(0)
} catch (e) {
	console.error('Error building the Library', e)
	process.exit(1)
}
