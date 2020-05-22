import TypeScript from 'rollup-plugin-typescript2';

export default {
    input: 'src/Kennel.ts',
    output: [
        {
            file: 'dist/Kennel.js',
            format: 'cjs'
        }
    ],
    external: ["url", "path", "zlib"],
    plugins: [
        TypeScript()
    ]
};