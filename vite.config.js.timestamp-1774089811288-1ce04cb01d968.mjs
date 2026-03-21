// vite.config.js
import { defineConfig } from "file:///C:/Users/bhaav/web%20development/frontend-donordash/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/bhaav/web%20development/frontend-donordash/node_modules/@vitejs/plugin-react/dist/index.mjs";
import tailwindcss from "file:///C:/Users/bhaav/web%20development/frontend-donordash/node_modules/tailwindcss/lib/index.js";
import autoprefixer from "file:///C:/Users/bhaav/web%20development/frontend-donordash/node_modules/autoprefixer/lib/autoprefixer.js";
import postcssImport from "file:///C:/Users/bhaav/web%20development/frontend-donordash/node_modules/postcss-import/index.js";
var vite_config_default = defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173
    // or any port you're using
  },
  css: {
    postcss: {
      plugins: [
        postcssImport(),
        // Add postcss-import first
        tailwindcss(),
        autoprefixer()
      ]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxiaGFhdlxcXFx3ZWIgZGV2ZWxvcG1lbnRcXFxcZnJvbnRlbmQtZG9ub3JkYXNoXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxiaGFhdlxcXFx3ZWIgZGV2ZWxvcG1lbnRcXFxcZnJvbnRlbmQtZG9ub3JkYXNoXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9iaGFhdi93ZWIlMjBkZXZlbG9wbWVudC9mcm9udGVuZC1kb25vcmRhc2gvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcclxuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gJ3RhaWx3aW5kY3NzJztcclxuaW1wb3J0IGF1dG9wcmVmaXhlciBmcm9tICdhdXRvcHJlZml4ZXInO1xyXG5pbXBvcnQgcG9zdGNzc0ltcG9ydCBmcm9tICdwb3N0Y3NzLWltcG9ydCc7IC8vIEltcG9ydCBwb3N0Y3NzLWltcG9ydFxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbcmVhY3QoKV0sXHJcbiAgIHNlcnZlcjoge1xyXG4gICAgaG9zdDogJzAuMC4wLjAnLFxyXG4gICAgcG9ydDogNTE3MywgLy8gb3IgYW55IHBvcnQgeW91J3JlIHVzaW5nXHJcbiAgfSxcclxuICBjc3M6IHtcclxuICAgIHBvc3Rjc3M6IHtcclxuICAgICAgcGx1Z2luczogW1xyXG4gICAgICAgIHBvc3Rjc3NJbXBvcnQoKSwgLy8gQWRkIHBvc3Rjc3MtaW1wb3J0IGZpcnN0XHJcbiAgICAgICAgdGFpbHdpbmRjc3MoKSxcclxuICAgICAgICBhdXRvcHJlZml4ZXIoKSxcclxuICAgICAgXSxcclxuICAgIH0sXHJcbiAgfSxcclxufSk7Il0sCiAgIm1hcHBpbmdzIjogIjtBQUFpVixTQUFTLG9CQUFvQjtBQUM5VyxPQUFPLFdBQVc7QUFDbEIsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxrQkFBa0I7QUFDekIsT0FBTyxtQkFBbUI7QUFFMUIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBQ2hCLFFBQVE7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQTtBQUFBLEVBQ1I7QUFBQSxFQUNBLEtBQUs7QUFBQSxJQUNILFNBQVM7QUFBQSxNQUNQLFNBQVM7QUFBQSxRQUNQLGNBQWM7QUFBQTtBQUFBLFFBQ2QsWUFBWTtBQUFBLFFBQ1osYUFBYTtBQUFBLE1BQ2Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
