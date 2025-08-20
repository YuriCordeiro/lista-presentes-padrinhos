import type { Gift } from '../types';

export const mockGifts: Gift[] = [
  {
    id: 'gift-teste-1',
    title: 'Jogo de Panelas Tramontina',
    productUrl: 'https://www.tramontina.com.br/produto/conjunto-de-panelas-antiaderente-paris-7-pecas-tramontina-20598712',
    imageUrl: 'https://images.tramontina.com.br/produtos/20598712/1/zoom-brinox-conjunto-de-panelas-antiaderente-paris-7-pecas-tramontina-20598712.jpg',
    order: 1,
    visible: true,
    reserved: false,
    timestamp: Date.now(),
    createdAt: new Date().toISOString(),
    source: 'google_sheets',
  },
  {
    id: 'gift-teste-2',
    title: 'Cafeteira Nespresso',
    productUrl: 'https://www.nespresso.com/br/pt/order/machines/vertuo/vertuo-plus-white',
    imageUrl: 'https://www.nespresso.com/shared_res/agility/n-components/srp/02_08_2024-09_48_02-AdobeStock_341358848.jpeg',
    order: 2,
    visible: true,
    reserved: false,
    timestamp: Date.now(),
    createdAt: new Date().toISOString(),
    source: 'google_sheets',
  },
  {
    id: 'gift-teste-3',
    title: 'Aspirador Robot iRobot',
    productUrl: 'https://www.irobot.com.br/roomba-i7-plus',
    imageUrl: 'https://d2r9epyceweg5n.cloudfront.net/stores/001/234/567/products/roomba-i7-plus1-c1234567890123456789012345678901234567890123456789012345678901234567890.png',
    order: 3,
    visible: true,
    reserved: false,
    timestamp: Date.now(),
    createdAt: new Date().toISOString(),
    source: 'google_sheets',
  }
];
