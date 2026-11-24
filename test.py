import asyncio
from playwright.async_api import async_playwright
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(headless=True,executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
  page=await browser.new_page(viewport={'width':1440,'height':1000})
  await page.goto('http://localhost:4200');await page.get_by_text('Гель будалт',exact=False).first.wait_for()
  await page.screenshot(path='/home/user/babes-nails/desktop.png',full_page=True)
  await page.get_by_role('button',name='Цаг захиалах',exact=False).first.click()
  await page.get_by_role('button',name='Үргэлжлүүлэх').click()
  from datetime import datetime,timedelta
  date=(datetime.now()+timedelta(days=2)).strftime('%Y-%m-%d')
  await page.locator('input[type=date]').fill(date)
  await page.get_by_role('button',name='10:00',exact=True).click()
  await page.get_by_role('button',name='Үргэлжлүүлэх').click()
  await page.locator('input[name=name]').fill('Тест захиалга')
  await page.locator('input[name=phone]').fill('99112233')
  await page.get_by_role('button',name='Захиалга илгээх').click()
  await page.get_by_text('Захиалга илгээгдлээ.',exact=True).wait_for(timeout=20000)
  print('Booking persisted success')
  await page.goto('http://localhost:4200/admin')
  from pathlib import Path
  env=dict(l.split('=',1) for l in Path('/home/user/babes-nails/.env').read_text().splitlines() if '=' in l)
  await page.locator('input[name=email]').fill(env['ADMIN_EMAIL'].strip(chr(34)+chr(39)));await page.locator('input[name=password]').fill(env['ADMIN_PASSWORD'].strip(chr(34)+chr(39)));await page.get_by_role('button',name='Нэвтрэх',exact=True).click()
  await page.get_by_text('Тест захиалга',exact=True).wait_for(timeout=15000)
  page.once('dialog',lambda d:d.accept())
  await page.get_by_role('button',name='Цуцлах',exact=True).first.click()
  await page.get_by_text('Цуцлагдсан',exact=True).last.wait_for()
  print('Admin login, list, cancellation verified')
  await page.set_viewport_size({'width':390,'height':844});await page.goto('http://localhost:4200');await page.screenshot(path='/home/user/babes-nails/mobile.png',full_page=True)
  print('overflow',await page.evaluate('document.documentElement.scrollWidth>innerWidth'))
  await browser.close()
asyncio.run(main())
