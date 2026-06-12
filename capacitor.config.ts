import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.salaryscraper.app',
  appName: 'Salary Scraper',
  webDir: 'out',
  server: {
    url: 'https://salaryscraper.com',
    cleartext: false,
  },
}

export default config
