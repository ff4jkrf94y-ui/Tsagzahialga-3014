import asyncio
from pathlib import Path
from datetime import datetime,timedelta
from playwright.async_api import async_playwright
async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
  page=await b.new_page(viewport={'width':390,'height':844})
  await page.goto('http://localhost:4200');await page.get_by_text('Смарт хумс · энгийн будалт',exact=True).wait_for()
  assert 'минут' not in await page.locator('main').inner_text()
  assert 'ЭРДЭНЭТ ХОТ' in await page.locator('header').inner_text()
  await page.get_by_role('button',name='Смарт хумс · энгийн будалт',exact=False).click();await page.get_by_role('button',name='Үргэлжлүүлэх').click()
  day=(datetime.now()+timedelta(days=7)).strftime('%Y-%m-%d')
  await page.locator('input[type=date]').fill(day);await page.get_by_role('button',name='10:00',exact=True).click();assert await page.get_by_role('button',name='19:00',exact=True).count()==1;assert await page.get_by_role('button',name='19:30',exact=True).count()==0
  await page.get_by_role('button',name='Үргэлжлүүлэх').click();await page.locator('input[name=name]').fill('Цуцлах тест');await page.locator('input[name=phone]').fill('99112233');await page.get_by_role('button',name='Захиалга илгээх').click();await page.get_by_text('Захиалга илгээгдлээ.',exact=True).wait_for()
  await page.goto('http://localhost:4200/admin');env=dict(l.split('=',1) for l in Path('.env').read_text().splitlines() if '=' in l)
  await page.locator('input[name=email]').fill(env['ADMIN_EMAIL'].strip('\"\''));await page.locator('input[name=password]').fill(env['ADMIN_PASSWORD'].strip('\"\''));await page.get_by_role('button',name='Нэвтрэх',exact=True).click();await page.get_by_text('Цуцлах тест',exact=True).wait_for()
  card=page.locator('article').filter(has_text='Цуцлах тест');await card.get_by_role('button',name='Баталгаажуулах',exact=True).click();await card.get_by_role('link',name='SMS мэдэгдэл нээх').wait_for()
  href=await card.get_by_role('link',name='SMS мэдэгдэл нээх').get_attribute('href');assert href.startswith('sms:+97699112233?body=')
  from urllib.parse import unquote
  assert 'баталгаажлаа' in unquote(href)
  await card.get_by_role('button',name='Цуцлах',exact=True).click();await card.get_by_role('button',name='Тийм, цуцлах',exact=True).click();await card.get_by_text('Цуцлагдсан',exact=True).wait_for();await page.reload();await page.locator('article').filter(has_text='Цуцлах тест').get_by_text('Цуцлагдсан',exact=True).wait_for()
  await page.goto('http://localhost:4200');await page.get_by_role('button',name='Смарт хумс · энгийн будалт',exact=False).click();await page.get_by_role('button',name='Үргэлжлүүлэх').click();await page.locator('input[type=date]').fill(day);await page.get_by_role('button',name='10:00',exact=True).wait_for()
  print('Verified: 4-hour smart allocation, SMS recipient/message, inline cancellation, cancellation persistence and freed slot.')
  await b.close()
asyncio.run(main())
