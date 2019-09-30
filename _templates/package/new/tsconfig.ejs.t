---
to: packages/<%= name %>/tsconfig.json
---
{
  "extends": "../tsconfig.settings.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "baseUrl": "."
  },      
  "include": [
    "src/**/*"
  ]
}
