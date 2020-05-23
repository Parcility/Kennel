import TypeScript from 'rollup-plugin-typescript2';
import uglify from "@lopatnov/rollup-plugin-uglify";
import copy from 'rollup-plugin-copy';

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
        TypeScript(),
        uglify(),
        copy({targets: [{ src: 'src/kennel.css', dest: 'dist/' }]})
    ]
};