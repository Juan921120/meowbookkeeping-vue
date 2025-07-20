<template>
<div class="container">
        <div class="table-wrapper">
            <div class="financial-table">
            <div class="table-header">
                <div class="header-cell">月份</div>
                <div class="header-cell">支出</div>
                <div class="header-cell">收入</div>
                <div class="header-cell">结余</div>
                <div class="header-cell"></div>
            </div>
            
            <div class="table-row">
                <div class="cell month-cell">7月</div>
                <div class="cell expense">- 1206.00</div>
                <div class="cell income">+ 1200.00</div>
                <div class="cell balance negative">- 6.00</div>
                <div class="cell">
                    <span class="arrow">></span>
                </div>
            </div>
            
            <div class="table-row">
                <div class="cell month-cell">6月</div>
                <div class="cell balance zero">0.00</div>
                <div class="cell balance zero">0.00</div>
                <div class="cell balance zero">0.00</div>
                <div class="cell">
                    <span class="arrow">></span>
                </div>
            </div>
            
            <div class="table-row">
                <div class="cell month-cell">5月</div>
                <div class="cell balance zero">0.00</div>
                <div class="cell balance zero">0.00</div>
                <div class="cell balance zero">0.00</div>
                <div class="cell">
                    <span class="arrow">></span>
                </div>
            </div>
            
            <div class="table-row">
                <div class="cell month-cell">4月</div>
                <div class="cell balance zero">0.00</div>
                <div class="cell balance zero">0.00</div>
                <div class="cell balance zero">0.00</div>
                <div class="cell">
                    <span class="arrow">></span>
                </div>
            </div>
            
            <div class="table-row">
                <div class="cell month-cell">3月</div>
                <div class="cell balance zero">0.00</div>
                <div class="cell balance zero">0.00</div>
                <div class="cell balance zero">0.00</div>
                <div class="cell">
                    <span class="arrow">></span>
                </div>
            </div>
            
            <div class="table-row">
                <div class="cell month-cell">2月</div>
                <div class="cell balance zero">0.00</div>
                <div class="cell balance zero">0.00</div>
                <div class="cell balance zero">0.00</div>
                <div class="cell">
                    <span class="arrow">></span>
                </div>
            </div>
            
            <div class="table-row">
                <div class="cell month-cell">1月</div>
                <div class="cell balance zero">0.00</div>
                <div class="cell balance zero">0.00</div>
                <div class="cell balance zero">0.00</div>
                <div class="cell">
                    <span class="arrow">></span>
                </div>
            </div>
            </div>
        </div>
    </div>
</template>
<script setup>

</script>
<style scoped>

body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }

        .container {
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            max-width: 500px;
            width: 100%;
            min-width: 320px;
            position: relative;
        }

        .table-wrapper {
            position: relative;
            border-radius: 12px;
            overflow: hidden;
        }

        .table-wrapper::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border: 3px solid #333;
            border-radius: 12px;
            filter: url(#jagged);
            pointer-events: none;
            z-index: 1;
        }

        .financial-table {
            width: 100%;
            border-radius: 12px;
            overflow: hidden;
            font-size: 14px;
            background: white;
            position: relative;
            z-index: 0;
        }

        .table-header {
            background: linear-gradient(135deg, #f4d03f, #f7dc6f);
            display: flex;
            font-weight: bold;
            border-bottom: 2px solid #333;
        }

        .header-cell {
            flex: 1;
            padding: 10px 4px;
            text-align: center;
            border-right: 2px solid #333;
            font-size: 13px;
        }

        .header-cell:last-child {
            border-right: none;
            flex: 0.4;
        }

        .table-row {
            display: flex;
            border-bottom: 1px solid #ddd;
            transition: background-color 0.2s ease;
            min-height: 44px;
        }

        .table-row:hover {
            background-color: #f8f9fa;
        }

        .table-row:last-child {
            border-bottom: none;
        }

        .cell {
            flex: 1;
            padding: 10px 4px;
            text-align: center;
            border-right: 1px solid #ddd;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
        }

        .cell:last-child {
            border-right: none;
            flex: 0.4;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 16px;
            color: #666;
            touch-action: manipulation;
        }

        .cell:last-child:hover {
            color: #333;
        }

        /* 手机端适配 */
        @media screen and (max-width: 480px) {
            body {
                padding: 5px;
            }
            
            .container {
                padding: 10px;
            }
            
            .financial-table {
                font-size: 12px;
            }
            
            .header-cell {
                padding: 8px 2px;
                font-size: 11px;
            }
            
            .cell {
                padding: 8px 2px;
                font-size: 11px;
            }
            
            .cell:last-child {
                font-size: 14px;
            }
            
            .table-row {
                min-height: 40px;
            }
        }

        /* 超小屏幕适配 */
        @media screen and (max-width: 360px) {
            .financial-table {
                font-size: 11px;
            }
            
            .header-cell {
                padding: 6px 1px;
                font-size: 10px;
            }
            
            .cell {
                padding: 6px 1px;
                font-size: 10px;
            }
            
            .cell:last-child {
                font-size: 12px;
            }
            
            .table-row {
                min-height: 36px;
            }
        }

        .month-cell {
            font-weight: 500;
            color: #333;
        }

        .expense {
            color: #e74c3c;
            font-weight: 500;
        }

        .income {
            color: #27ae60;
            font-weight: 500;
        }

        .balance {
            font-weight: 500;
        }

        .balance.negative {
            color: #e74c3c;
        }

        .balance.positive {
            color: #27ae60;
        }

        .balance.zero {
            color: #7f8c8d;
        }

        .arrow {
            transform: rotate(90deg);
            transition: transform 0.2s ease;
        }

        .arrow:hover {
            transform: rotate(90deg) scale(1.2);
        }

</style>
