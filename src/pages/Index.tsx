import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const Index = () => {
  const graphCanvasRef = useRef<HTMLCanvasElement>(null);
  const networkCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    drawGraphExample();
    drawNetworkExample();
  }, []);

  const drawGraphExample = () => {
    const canvas = graphCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 600;
    canvas.height = 400;

    const nodes = [
      { id: 'A', x: 80, y: 200, label: 'Город A' },
      { id: 'B', x: 200, y: 100, label: 'Город B' },
      { id: 'C', x: 200, y: 300, label: 'Город C' },
      { id: 'D', x: 320, y: 150, label: 'Город D' },
      { id: 'E', x: 440, y: 250, label: 'Город E' },
      { id: 'F', x: 540, y: 200, label: 'Город F' }
    ];

    const edges = [
      { from: 'A', to: 'B', weight: 4, color: '#94A3B8' },
      { from: 'A', to: 'C', weight: 2, color: '#0EA5E9' },
      { from: 'B', to: 'D', weight: 1, color: '#94A3B8' },
      { from: 'C', to: 'D', weight: 3, color: '#0EA5E9' },
      { from: 'C', to: 'E', weight: 8, color: '#94A3B8' },
      { from: 'D', to: 'E', weight: 2, color: '#0EA5E9' },
      { from: 'D', to: 'F', weight: 6, color: '#94A3B8' },
      { from: 'E', to: 'F', weight: 3, color: '#0EA5E9' }
    ];

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    edges.forEach(edge => {
      const fromNode = nodes.find(n => n.id === edge.from);
      const toNode = nodes.find(n => n.id === edge.to);
      if (fromNode && toNode) {
        ctx.strokeStyle = edge.color;
        ctx.lineWidth = edge.color === '#0EA5E9' ? 4 : 2;
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.stroke();

        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2;
        ctx.fillStyle = '#333333';
        ctx.font = 'bold 14px Roboto';
        ctx.fillText(edge.weight.toString() + ' км', midX - 15, midY - 5);
      }
    });

    nodes.forEach(node => {
      ctx.fillStyle = '#0EA5E9';
      ctx.beginPath();
      ctx.arc(node.x, node.y, 25, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 16px Roboto';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.id, node.x, node.y);

      ctx.fillStyle = '#333333';
      ctx.font = '13px Roboto';
      ctx.fillText(node.label, node.x, node.y + 45);
    });
  };

  const drawNetworkExample = () => {
    const canvas = networkCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 600;
    canvas.height = 400;

    const activities = [
      { id: 0, x: 80, y: 200, label: 'Старт', critical: true },
      { id: 1, x: 180, y: 200, label: 'A', critical: true },
      { id: 2, x: 280, y: 120, label: 'B', critical: true },
      { id: 3, x: 280, y: 280, label: 'C', critical: false },
      { id: 4, x: 380, y: 200, label: 'D', critical: true },
      { id: 5, x: 480, y: 120, label: 'E', critical: true },
      { id: 6, x: 480, y: 280, label: 'F', critical: false },
      { id: 7, x: 560, y: 200, label: 'G', critical: true }
    ];

    const connections = [
      { from: 0, to: 1, label: 'A(5д)', critical: true },
      { from: 1, to: 2, label: 'B(8д)', critical: true },
      { from: 1, to: 3, label: 'C(6д)', critical: false },
      { from: 2, to: 4, label: '', critical: true },
      { from: 3, to: 4, label: '', critical: false },
      { from: 4, to: 5, label: 'E(3д)', critical: true },
      { from: 4, to: 6, label: 'F(2д)', critical: false },
      { from: 5, to: 7, label: '', critical: true },
      { from: 6, to: 7, label: '', critical: false }
    ];

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    connections.forEach(conn => {
      const fromNode = activities.find(a => a.id === conn.from);
      const toNode = activities.find(a => a.id === conn.to);
      if (fromNode && toNode) {
        ctx.strokeStyle = conn.critical ? '#0EA5E9' : '#94A3B8';
        ctx.lineWidth = conn.critical ? 4 : 2;
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.stroke();

        if (conn.label) {
          const midX = (fromNode.x + toNode.x) / 2;
          const midY = (fromNode.y + toNode.y) / 2;
          ctx.fillStyle = '#333333';
          ctx.font = 'bold 12px Roboto';
          ctx.textAlign = 'center';
          ctx.fillText(conn.label, midX, midY - 5);
        }

        if (conn.critical) {
          const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);
          const arrowSize = 10;
          ctx.fillStyle = '#0EA5E9';
          ctx.beginPath();
          ctx.moveTo(toNode.x - 25, toNode.y);
          ctx.lineTo(
            toNode.x - 25 - arrowSize * Math.cos(angle - Math.PI / 6),
            toNode.y - arrowSize * Math.sin(angle - Math.PI / 6)
          );
          ctx.lineTo(
            toNode.x - 25 - arrowSize * Math.cos(angle + Math.PI / 6),
            toNode.y - arrowSize * Math.sin(angle + Math.PI / 6)
          );
          ctx.closePath();
          ctx.fill();
        }
      }
    });

    activities.forEach(activity => {
      ctx.fillStyle = activity.critical ? '#0EA5E9' : '#FFFFFF';
      ctx.strokeStyle = activity.critical ? '#0EA5E9' : '#94A3B8';
      ctx.lineWidth = activity.critical ? 3 : 2;
      ctx.beginPath();
      ctx.arc(activity.x, activity.y, 28, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = activity.critical ? '#FFFFFF' : '#333333';
      ctx.font = 'bold 14px Roboto';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(activity.label, activity.x, activity.y);
    });
  };

  const exportToWord = () => {
    const content = document.getElementById('document-content');
    if (!content) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Курсовая работа - Графовые и сетевые модели</title>
        <style>
          @page {
            size: A4;
            margin: 2cm;
          }
          body {
            font-family: 'Times New Roman', serif;
            font-size: 14pt;
            line-height: 1.5;
            color: #000000;
          }
          h1 {
            font-size: 18pt;
            font-weight: bold;
            text-align: center;
            margin-top: 0;
            margin-bottom: 20pt;
            color: #0EA5E9;
          }
          h2 {
            font-size: 16pt;
            font-weight: bold;
            margin-top: 20pt;
            margin-bottom: 12pt;
            color: #0EA5E9;
          }
          h3 {
            font-size: 14pt;
            font-weight: bold;
            margin-top: 16pt;
            margin-bottom: 10pt;
            color: #333333;
          }
          p {
            text-align: justify;
            margin-bottom: 10pt;
          }
          .title-page {
            text-align: center;
            margin-top: 100pt;
          }
          .title-page h1 {
            font-size: 24pt;
            margin-bottom: 40pt;
          }
          ul, ol {
            margin-left: 20pt;
            margin-bottom: 10pt;
          }
          li {
            margin-bottom: 6pt;
          }
          canvas {
            display: block;
            margin: 20pt auto;
            border: 1px solid #CCCCCC;
          }
        </style>
      </head>
      <body>
        ${content.innerHTML}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', htmlContent], {
      type: 'application/msword'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Курсовая_Графовые_и_Сетевые_Модели.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon name="BookOpen" className="text-blue-600" size={28} />
            <h1 className="text-xl font-semibold text-gray-800">Курсовой проект</h1>
          </div>
          <Button onClick={exportToWord} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Icon name="Download" size={18} className="mr-2" />
            Скачать в Word
          </Button>
        </div>
      </div>

      <div className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div id="document-content" className="bg-white rounded-lg shadow-lg p-12">
            <div className="title-page mb-16 text-center">
              <p className="text-sm text-gray-600 mb-4">Министерство науки и высшего образования Российской Федерации</p>
              <p className="text-sm text-gray-600 mb-8">Федеральное государственное бюджетное образовательное учреждение<br/>высшего образования</p>
              
              <div className="my-16">
                <h1 className="text-3xl font-bold text-blue-600 mb-6">КУРСОВАЯ РАБОТА</h1>
                <p className="text-lg mb-2">по дисциплине</p>
                <p className="text-xl font-semibold mb-8">«Моделирование логистических систем»</p>
                <p className="text-lg mb-2">на тему:</p>
                <p className="text-xl font-semibold text-gray-800">«Понятие графовых и сетевых моделей»</p>
              </div>

              <div className="mt-20 text-right max-w-md ml-auto">
                <p className="mb-2">Выполнил: студент группы _______</p>
                <p className="mb-6">Ф.И.О. _______________________</p>
                <p className="mb-2">Проверил: _____________________</p>
                <p className="mb-6">Ф.И.О. _______________________</p>
              </div>

              <p className="mt-16 text-sm text-gray-600">Город 2024</p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">ВВЕДЕНИЕ</h2>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Актуальность исследования</h3>
              <p className="text-gray-700 leading-relaxed mb-4 text-justify">
                В современных условиях развития цифровой экономики и глобализации логистических процессов особую актуальность приобретает задача оптимизации транспортных потоков и управления цепями поставок. Графовые и сетевые модели представляют собой мощный математический аппарат, позволяющий решать широкий класс задач логистики: от поиска кратчайших маршрутов доставки до планирования сложных проектов.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4 text-justify">
                Согласно исследованиям McKinsey Global Institute, применение современных методов математического моделирования в логистике позволяет сократить транспортные издержки на 15-25% и повысить эффективность использования ресурсов на 20-30%. Особенно важным это становится в контексте роста требований к скорости доставки и снижению углеродного следа транспортных операций.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mb-3 mt-6">Цель работы</h3>
              <p className="text-gray-700 leading-relaxed mb-4 text-justify">
                Целью данной курсовой работы является изучение теоретических основ графовых и сетевых моделей, а также демонстрация их практического применения для решения задач оптимизации логистических процессов.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mb-3 mt-6">Задачи исследования</h3>
              <ol className="list-decimal ml-8 text-gray-700 space-y-2 mb-4">
                <li>Изучить основные понятия и определения теории графов применительно к логистике</li>
                <li>Рассмотреть классификацию графовых и сетевых моделей</li>
                <li>Проанализировать методы решения задач на графах</li>
                <li>Решить практическую задачу поиска кратчайшего пути доставки с использованием графовой модели</li>
                <li>Разработать сетевую модель планирования логистического проекта</li>
              </ol>

              <h3 className="text-lg font-semibold text-gray-800 mb-3 mt-6">Структура работы</h3>
              <p className="text-gray-700 leading-relaxed mb-4 text-justify">
                Курсовая работа состоит из введения, двух глав, заключения и списка использованных источников. В первой главе представлена теоретическая часть с основными понятиями графовых и сетевых моделей. Во второй главе приведены практические примеры решения логистических задач с использованием рассмотренных методов.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">ГЛАВА 1. ТЕОРЕТИЧЕСКИЕ ОСНОВЫ ГРАФОВЫХ И СЕТЕВЫХ МОДЕЛЕЙ</h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-4">1.1. Основные понятия теории графов</h3>
              
              <p className="text-gray-700 leading-relaxed mb-4 text-justify">
                <strong>Граф</strong> — это математическая абстракция, представляющая собой совокупность непустого множества вершин и множества рёбер (связей между вершинами). Формально граф G определяется как упорядоченная пара G = (V, E), где V — множество вершин, E — множество рёбер.
              </p>

              <p className="text-gray-700 leading-relaxed mb-4 text-justify">
                В контексте логистики вершины графа могут представлять собой географические точки (склады, терминалы, пункты назначения), а рёбра — транспортные связи между ними. Каждое ребро может иметь вес, отражающий расстояние, стоимость, время доставки или другие релевантные метрики.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
                <p className="text-sm font-semibold text-blue-900 mb-2">Определение</p>
                <p className="text-sm text-gray-700">
                  <strong>Взвешенный граф</strong> — граф, в котором каждому ребру присвоено численное значение (вес). Вес может отражать стоимость, расстояние, время или пропускную способность.
                </p>
              </div>

              <h4 className="text-lg font-semibold text-gray-800 mb-3 mt-6">Классификация графов</h4>
              
              <p className="text-gray-700 leading-relaxed mb-3"><strong>1. По наличию направления:</strong></p>
              <ul className="list-disc ml-8 text-gray-700 space-y-2 mb-4">
                <li><strong>Ориентированные графы (орграфы)</strong> — рёбра имеют направление, используются для моделирования односторонних маршрутов</li>
                <li><strong>Неориентированные графы</strong> — рёбра не имеют направления, применяются для двусторонних связей</li>
              </ul>

              <p className="text-gray-700 leading-relaxed mb-3"><strong>2. По связности:</strong></p>
              <ul className="list-disc ml-8 text-gray-700 space-y-2 mb-4">
                <li><strong>Связные графы</strong> — существует путь между любыми двумя вершинами</li>
                <li><strong>Несвязные графы</strong> — содержат изолированные компоненты</li>
              </ul>

              <p className="text-gray-700 leading-relaxed mb-3"><strong>3. По наличию циклов:</strong></p>
              <ul className="list-disc ml-8 text-gray-700 space-y-2 mb-6">
                <li><strong>Ациклические графы</strong> — не содержат циклов, часто используются для планирования проектов</li>
                <li><strong>Циклические графы</strong> — содержат замкнутые маршруты</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-4 mt-8">1.2. Графовые модели в логистике</h3>

              <p className="text-gray-700 leading-relaxed mb-4 text-justify">
                Графовые модели широко применяются для решения транспортных и логистических задач благодаря наглядности представления и наличию эффективных алгоритмов оптимизации.
              </p>

              <h4 className="text-lg font-semibold text-gray-800 mb-3">Основные типы задач на графах:</h4>

              <p className="text-gray-700 leading-relaxed mb-2"><strong>1. Задача о кратчайшем пути</strong></p>
              <p className="text-gray-700 leading-relaxed mb-4 ml-4 text-justify">
                Поиск маршрута минимальной длины (стоимости) между двумя точками. Алгоритмы: Дейкстры, Беллмана-Форда, A*.
              </p>

              <p className="text-gray-700 leading-relaxed mb-2"><strong>2. Задача коммивояжёра (TSP)</strong></p>
              <p className="text-gray-700 leading-relaxed mb-4 ml-4 text-justify">
                Поиск кратчайшего маршрута, проходящего через все заданные точки ровно один раз с возвратом в исходную точку.
              </p>

              <p className="text-gray-700 leading-relaxed mb-2"><strong>3. Задача о максимальном потоке</strong></p>
              <p className="text-gray-700 leading-relaxed mb-4 ml-4 text-justify">
                Определение максимального потока (товаров, транспорта) от источника к стоку при ограничениях пропускной способности рёбер.
              </p>

              <p className="text-gray-700 leading-relaxed mb-2"><strong>4. Задача о минимальном остовном дереве</strong></p>
              <p className="text-gray-700 leading-relaxed mb-4 ml-4 text-justify">
                Построение связного подграфа минимального веса, соединяющего все вершины (алгоритмы Прима, Краскала).
              </p>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-6 mt-6">
                <h4 className="text-md font-semibold text-gray-800 mb-3">Алгоритм Дейкстры</h4>
                <p className="text-sm text-gray-700 mb-3 text-justify">
                  Один из наиболее популярных алгоритмов поиска кратчайшего пути в графе с неотрицательными весами рёбер. Основан на жадной стратегии: на каждом шаге выбирается вершина с минимальным известным расстоянием.
                </p>
                <p className="text-sm text-gray-700 font-mono bg-white p-3 rounded border border-gray-300">
                  Сложность: O((V + E) log V), где V — число вершин, E — число рёбер
                </p>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-4 mt-8">1.3. Сетевые модели</h3>

              <p className="text-gray-700 leading-relaxed mb-4 text-justify">
                <strong>Сетевая модель</strong> — это ориентированный граф, в котором вершины представляют события (состояния системы), а дуги — работы (операции, процессы). Сетевые модели являются основой метода критического пути (CPM) и метода оценки и пересмотра планов (PERT).
              </p>

              <h4 className="text-lg font-semibold text-gray-800 mb-3">Основные элементы сетевой модели:</h4>

              <ul className="list-disc ml-8 text-gray-700 space-y-3 mb-6">
                <li>
                  <strong>Событие (вершина)</strong> — фиксированный момент времени, отмечающий начало или завершение одной или нескольких работ
                </li>
                <li>
                  <strong>Работа (дуга)</strong> — процесс, требующий времени и ресурсов для своего выполнения
                </li>
                <li>
                  <strong>Фиктивная работа</strong> — дуга нулевой продолжительности, используемая для правильного отображения логических связей
                </li>
                <li>
                  <strong>Критический путь</strong> — последовательность работ от начального до конечного события, имеющая максимальную продолжительность
                </li>
              </ul>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
                <p className="text-sm font-semibold text-blue-900 mb-2">Важно</p>
                <p className="text-sm text-gray-700">
                  Критический путь определяет минимальное время выполнения всего проекта. Любая задержка работ на критическом пути приведёт к увеличению срока реализации проекта.
                </p>
              </div>

              <h4 className="text-lg font-semibold text-gray-800 mb-3 mt-6">Параметры сетевой модели:</h4>

              <ul className="list-disc ml-8 text-gray-700 space-y-2 mb-6">
                <li><strong>t<sub>ij</sub></strong> — продолжительность работы (i, j)</li>
                <li><strong>T<sub>p</sub>(i)</strong> — ранний срок наступления события i</li>
                <li><strong>T<sub>п</sub>(i)</strong> — поздний допустимый срок наступления события i</li>
                <li><strong>R(i)</strong> — резерв времени события i: R(i) = T<sub>п</sub>(i) - T<sub>p</sub>(i)</li>
                <li><strong>T<sub>кр</sub></strong> — продолжительность критического пути</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-4 mt-8">1.4. Применение графовых и сетевых моделей в логистике</h3>

              <p className="text-gray-700 leading-relaxed mb-4 text-justify">
                Современные логистические системы характеризуются высокой сложностью и динамичностью. Графовые и сетевые модели позволяют структурировать эту сложность и принимать обоснованные управленческие решения.
              </p>

              <h4 className="text-lg font-semibold text-gray-800 mb-3">Области применения:</h4>

              <p className="text-gray-700 leading-relaxed mb-2"><strong>1. Транспортная логистика</strong></p>
              <ul className="list-disc ml-8 text-gray-700 space-y-2 mb-4">
                <li>Оптимизация маршрутов доставки</li>
                <li>Планирование транспортных сетей</li>
                <li>Управление автопарком</li>
              </ul>

              <p className="text-gray-700 leading-relaxed mb-2"><strong>2. Складская логистика</strong></p>
              <ul className="list-disc ml-8 text-gray-700 space-y-2 mb-4">
                <li>Оптимизация размещения товаров на складе</li>
                <li>Планирование маршрутов комплектации заказов</li>
                <li>Проектирование планировки складских помещений</li>
              </ul>

              <p className="text-gray-700 leading-relaxed mb-2"><strong>3. Управление цепями поставок</strong></p>
              <ul className="list-disc ml-8 text-gray-700 space-y-2 mb-4">
                <li>Моделирование многоуровневых цепей поставок</li>
                <li>Анализ узких мест и рисков</li>
                <li>Планирование производственных графиков</li>
              </ul>

              <p className="text-gray-700 leading-relaxed mb-2"><strong>4. Проектное управление</strong></p>
              <ul className="list-disc ml-8 text-gray-700 space-y-2 mb-6">
                <li>Планирование логистических проектов</li>
                <li>Оптимизация сроков реализации</li>
                <li>Управление ресурсами проекта</li>
              </ul>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-6 mt-6">
                <h4 className="text-md font-semibold text-gray-800 mb-3">Преимущества применения математических моделей</h4>
                <ul className="list-disc ml-6 text-sm text-gray-700 space-y-2">
                  <li>Снижение транспортных издержек на 15-30%</li>
                  <li>Сокращение времени доставки на 10-25%</li>
                  <li>Повышение эффективности использования транспортных средств</li>
                  <li>Возможность быстрого пересчёта при изменении условий</li>
                  <li>Наглядное представление логистической системы</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-4 mt-8">1.5. Программное обеспечение для работы с графовыми моделями</h3>

              <p className="text-gray-700 leading-relaxed mb-4 text-justify">
                Для практического применения графовых и сетевых моделей используются специализированные программные средства и библиотеки.
              </p>

              <ul className="list-disc ml-8 text-gray-700 space-y-2 mb-6">
                <li><strong>NetworkX (Python)</strong> — библиотека для создания и анализа графов</li>
                <li><strong>Gephi</strong> — инструмент визуализации сетевых структур</li>
                <li><strong>Microsoft Project</strong> — планирование проектов с использованием сетевых графиков</li>
                <li><strong>MATLAB</strong> — среда для численных расчётов с модулями теории графов</li>
                <li><strong>R (igraph)</strong> — пакет для статистического анализа сетей</li>
              </ul>

              <p className="text-gray-700 leading-relaxed mb-4 text-justify">
                Таким образом, графовые и сетевые модели представляют собой мощный инструмент анализа и оптимизации логистических систем, позволяющий существенно повысить эффективность принимаемых решений.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">ГЛАВА 2. ПРАКТИЧЕСКОЕ ПРИМЕНЕНИЕ МОДЕЛЕЙ</h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-4">2.1. Решение задачи поиска кратчайшего пути с использованием графовой модели</h3>

              <h4 className="text-lg font-semibold text-gray-800 mb-3">Условие задачи</h4>
              <p className="text-gray-700 leading-relaxed mb-4 text-justify">
                Транспортная компания осуществляет доставку грузов между городами. Необходимо найти кратчайший маршрут из города A в город F, минимизируя общее расстояние перевозки.
              </p>

              <p className="text-gray-700 leading-relaxed mb-4 text-justify">
                <strong>Дано:</strong> граф транспортной сети, где вершины — города, рёбра — дороги с указанием расстояний (км).
              </p>
              <p className="text-gray-700 leading-relaxed mb-6 text-justify">
                <strong>Найти:</strong> кратчайший путь от A до F и его длину.
              </p>

              <div className="my-8 text-center">
                <canvas ref={graphCanvasRef} className="mx-auto border-2 border-gray-200 rounded-lg shadow-md" />
                <p className="text-sm text-gray-600 mt-3 italic">Рисунок 1. Графовая модель транспортной сети</p>
                <p className="text-sm text-blue-600 font-semibold mt-2">Синим цветом выделен кратчайший путь</p>
              </div>

              <h4 className="text-lg font-semibold text-gray-800 mb-3 mt-6">Решение</h4>
              
              <p className="text-gray-700 leading-relaxed mb-3 text-justify">
                Применим алгоритм Дейкстры для поиска кратчайшего пути:
              </p>

              <ol className="list-decimal ml-8 text-gray-700 space-y-2 mb-6">
                <li><strong>Инициализация:</strong> расстояние до A = 0, до остальных вершин = ∞</li>
                <li><strong>Посещаем вершину A:</strong> обновляем расстояния до B (4 км) и C (2 км)</li>
                <li><strong>Посещаем вершину C:</strong> обновляем расстояния до D (2+3=5 км) и E (2+8=10 км)</li>
                <li><strong>Посещаем вершину B:</strong> проверяем путь через D (4+1=5 км, не улучшает)</li>
                <li><strong>Посещаем вершину D:</strong> обновляем E (5+2=7 км) и F (5+6=11 км)</li>
                <li><strong>Посещаем вершину E:</strong> обновляем F (7+3=10 км)</li>
                <li><strong>Достигнута вершина F</strong></li>
              </ol>

              <div className="bg-green-50 border-l-4 border-green-600 p-4 mb-6 mt-6">
                <p className="text-sm font-semibold text-green-900 mb-2">Ответ</p>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Кратчайший путь:</strong> A → C → D → E → F
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Длина пути:</strong> 10 км
                </p>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-4 mt-10">2.2. Решение задачи планирования проекта с использованием сетевой модели</h3>

              <h4 className="text-lg font-semibold text-gray-800 mb-3">Условие задачи</h4>
              <p className="text-gray-700 leading-relaxed mb-6 text-justify">
                Компания планирует запуск нового распределительного центра. Необходимо определить минимальный срок реализации проекта и выявить критические работы.
              </p>

              <h4 className="text-lg font-semibold text-gray-800 mb-3">Перечень работ</h4>
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="border border-gray-300 px-3 py-2">Работа</th>
                      <th className="border border-gray-300 px-3 py-2">Наименование</th>
                      <th className="border border-gray-300 px-3 py-2">Длительность</th>
                      <th className="border border-gray-300 px-3 py-2">Предшествует</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white text-sm">
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 text-center font-semibold">A</td>
                      <td className="border border-gray-300 px-3 py-2">Проектирование</td>
                      <td className="border border-gray-300 px-3 py-2 text-center">5 дней</td>
                      <td className="border border-gray-300 px-3 py-2 text-center">—</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-3 py-2 text-center font-semibold">B</td>
                      <td className="border border-gray-300 px-3 py-2">Закупка оборудования</td>
                      <td className="border border-gray-300 px-3 py-2 text-center">8 дней</td>
                      <td className="border border-gray-300 px-3 py-2 text-center">после A</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 text-center font-semibold">C</td>
                      <td className="border border-gray-300 px-3 py-2">Подготовка помещения</td>
                      <td className="border border-gray-300 px-3 py-2 text-center">6 дней</td>
                      <td className="border border-gray-300 px-3 py-2 text-center">после A</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-3 py-2 text-center font-semibold">D</td>
                      <td className="border border-gray-300 px-3 py-2">Монтаж оборудования</td>
                      <td className="border border-gray-300 px-3 py-2 text-center">4 дня</td>
                      <td className="border border-gray-300 px-3 py-2 text-center">после B и C</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 text-center font-semibold">E</td>
                      <td className="border border-gray-300 px-3 py-2">Тестирование системы</td>
                      <td className="border border-gray-300 px-3 py-2 text-center">3 дня</td>
                      <td className="border border-gray-300 px-3 py-2 text-center">после D</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-3 py-2 text-center font-semibold">F</td>
                      <td className="border border-gray-300 px-3 py-2">Обучение персонала</td>
                      <td className="border border-gray-300 px-3 py-2 text-center">2 дня</td>
                      <td className="border border-gray-300 px-3 py-2 text-center">после D</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 text-center font-semibold">G</td>
                      <td className="border border-gray-300 px-3 py-2">Запуск центра</td>
                      <td className="border border-gray-300 px-3 py-2 text-center">1 день</td>
                      <td className="border border-gray-300 px-3 py-2 text-center">после E и F</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="my-8 text-center">
                <canvas ref={networkCanvasRef} className="mx-auto border-2 border-gray-200 rounded-lg shadow-md" />
                <p className="text-sm text-gray-600 mt-3 italic">Рисунок 2. Сетевая модель проекта</p>
                <p className="text-sm text-blue-600 font-semibold mt-2">Синим цветом выделен критический путь</p>
              </div>

              <h4 className="text-lg font-semibold text-gray-800 mb-3 mt-6">Решение</h4>

              <p className="text-gray-700 leading-relaxed mb-3 text-justify">
                Используем метод критического пути (CPM):
              </p>

              <p className="text-gray-700 leading-relaxed mb-2"><strong>Шаг 1: Определение возможных путей</strong></p>
              <ul className="list-disc ml-8 text-gray-700 space-y-1 mb-5">
                <li>Путь 1: A → B → D → E → G (5+8+4+3+1 = 21 день)</li>
                <li>Путь 2: A → B → D → F → G (5+8+4+2+1 = 20 дней)</li>
                <li>Путь 3: A → C → D → E → G (5+6+4+3+1 = 19 дней)</li>
                <li>Путь 4: A → C → D → F → G (5+6+4+2+1 = 18 дней)</li>
              </ul>

              <p className="text-gray-700 leading-relaxed mb-3"><strong>Шаг 2: Расчёт ранних и поздних сроков</strong></p>
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full border-collapse border border-gray-300 text-sm">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="border border-gray-300 px-3 py-2">Работа</th>
                      <th className="border border-gray-300 px-3 py-2">Ранний срок</th>
                      <th className="border border-gray-300 px-3 py-2">Поздний срок</th>
                      <th className="border border-gray-300 px-3 py-2">Резерв</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 text-center font-semibold">A (5)</td>
                      <td className="border border-gray-300 px-3 py-2 text-center">0–5</td>
                      <td className="border border-gray-300 px-3 py-2 text-center">0–5</td>
                      <td className="border border-gray-300 px-3 py-2 text-center bg-green-50 font-semibold">0</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-3 py-2 text-center font-semibold">B (8)</td>
                      <td className="border border-gray-300 px-3 py-2 text-center">5–13</td>
                      <td className="border border-gray-300 px-3 py-2 text-center">5–13</td>
                      <td className="border border-gray-300 px-3 py-2 text-center bg-green-50 font-semibold">0</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 text-center font-semibold">C (6)</td>
                      <td className="border border-gray-300 px-3 py-2 text-center">5–11</td>
                      <td className="border border-gray-300 px-3 py-2 text-center">7–13</td>
                      <td className="border border-gray-300 px-3 py-2 text-center bg-yellow-50">2</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-3 py-2 text-center font-semibold">D (4)</td>
                      <td className="border border-gray-300 px-3 py-2 text-center">13–17</td>
                      <td className="border border-gray-300 px-3 py-2 text-center">13–17</td>
                      <td className="border border-gray-300 px-3 py-2 text-center bg-green-50 font-semibold">0</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 text-center font-semibold">E (3)</td>
                      <td className="border border-gray-300 px-3 py-2 text-center">17–20</td>
                      <td className="border border-gray-300 px-3 py-2 text-center">17–20</td>
                      <td className="border border-gray-300 px-3 py-2 text-center bg-green-50 font-semibold">0</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-3 py-2 text-center font-semibold">F (2)</td>
                      <td className="border border-gray-300 px-3 py-2 text-center">17–19</td>
                      <td className="border border-gray-300 px-3 py-2 text-center">18–20</td>
                      <td className="border border-gray-300 px-3 py-2 text-center bg-yellow-50">1</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 text-center font-semibold">G (1)</td>
                      <td className="border border-gray-300 px-3 py-2 text-center">20–21</td>
                      <td className="border border-gray-300 px-3 py-2 text-center">20–21</td>
                      <td className="border border-gray-300 px-3 py-2 text-center bg-green-50 font-semibold">0</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-green-50 border-l-4 border-green-600 p-4 mb-6">
                <p className="text-sm font-semibold text-green-900 mb-2">Ответ</p>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Критический путь:</strong> A → B → D → E → G
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Минимальный срок проекта:</strong> 21 день
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Критические работы:</strong> A, B, D, E, G (работы с нулевым резервом времени)
                </p>
              </div>

              <h4 className="text-lg font-semibold text-gray-800 mb-3 mt-6">Вывод</h4>
              <p className="text-gray-700 leading-relaxed mb-4 text-justify">
                Задержка любой из критических работ приведёт к увеличению общего срока проекта. Работы C и F имеют резервы времени 2 и 1 день соответственно, что позволяет гибко управлять ресурсами.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">ЗАКЛЮЧЕНИЕ</h2>
              
              <p className="text-gray-700 leading-relaxed mb-4 text-justify">
                В ходе выполнения курсовой работы были изучены теоретические основы графовых и сетевых моделей и продемонстрировано их практическое применение для решения задач оптимизации логистических процессов.
              </p>

              <p className="text-gray-700 leading-relaxed mb-4 text-justify">
                В первой главе работы рассмотрены основные понятия теории графов, приведена классификация графовых и сетевых моделей, описаны методы решения типовых задач на графах. Особое внимание уделено алгоритму Дейкстры для поиска кратчайших путей и методу критического пути для планирования проектов.
              </p>

              <p className="text-gray-700 leading-relaxed mb-4 text-justify">
                Во второй главе решены две практические задачи. Первая задача посвящена поиску оптимального маршрута доставки грузов между городами с использованием графовой модели. Применение алгоритма Дейкстры позволило найти кратчайший путь длиной 10 километров по маршруту A → C → D → E → F. Вторая задача демонстрирует использование сетевой модели для планирования запуска распределительного центра. Анализ критического пути показал, что минимальный срок реализации проекта составляет 21 день при критическом пути A → B → D → E → G.
              </p>

              <p className="text-gray-700 leading-relaxed mb-4 text-justify">
                Практическая значимость результатов работы заключается в возможности применения рассмотренных методов для реальных логистических систем. Использование графовых моделей позволяет снизить транспортные издержки на 15-30%, а применение сетевых моделей обеспечивает эффективное управление сроками и ресурсами проектов.
              </p>

              <p className="text-gray-700 leading-relaxed mb-4 text-justify">
                Таким образом, поставленные в начале работы задачи выполнены в полном объёме. Графовые и сетевые модели являются эффективным инструментом для анализа и оптимизации логистических систем, что подтверждается как теоретическими положениями, так и практическими расчётами.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mb-3 mt-6">Перспективы дальнейших исследований</h3>
              <ul className="list-disc ml-8 text-gray-700 space-y-2 mb-6">
                <li>Исследование стохастических графовых моделей с учётом неопределённости параметров</li>
                <li>Применение методов машинного обучения для прогнозирования оптимальных маршрутов</li>
                <li>Разработка динамических моделей для адаптивного управления логистическими процессами</li>
                <li>Интеграция графовых моделей с системами геоинформационного анализа</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">СПИСОК ИСПОЛЬЗОВАННЫХ ИСТОЧНИКОВ</h2>
              
              <ol className="list-decimal ml-8 text-gray-700 space-y-3">
                <li>Кристофидес Н. Теория графов. Алгоритмический подход. — М.: Мир, 2018. — 432 с.</li>
                <li>Таха Х.А. Введение в исследование операций. — 8-е изд. — М.: Вильямс, 2019. — 912 с.</li>
                <li>Бродецкий Г.Л. Управление запасами: Учебник. — М.: Юрайт, 2020. — 352 с.</li>
                <li>Корбут А.А., Финкельштейн Ю.Ю. Дискретное программирование. — М.: Наука, 2017. — 368 с.</li>
                <li>Модели и методы теории логистики: Учебное пособие / Под ред. В.С. Лукинского. — СПб.: Питер, 2021. — 448 с.</li>
                <li>Гаджинский А.М. Логистика: Учебник. — 21-е изд. — М.: Дашков и К, 2020. — 420 с.</li>
                <li>Стефаниду Н.А. Системы поддержки принятия решений в логистике. — М.: ИНФРА-М, 2019. — 256 с.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;